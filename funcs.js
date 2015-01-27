var FUNCS = {};

var T_MCR = 'macro',
    T_MOV = 'move',
    T_INS = 'insert',
    T_OPR = 'operator',
    T_FND = 'find',
    T_EXT = 'extra',
    T_TAG = 'tag',
    T_CMD = 'command',
    T_COD = 'code';

var F_PRE = 0x1,
    F_POS = 0x2;

function Mapping(key) {

    var shifted = function(key) {
        if (key.match(/[a-zA-Z0-9]/)) {
            return key.toUpperCase();
        } else {
            switch (key) {
                case '[':   return '{';
                case ']':   return '}';
                case '\\':  return '|';
                case ';':   return ':';
                case '\'':  return '"';
                case ',':   return '<';
                case '.':   return '>';
                case '/':   return '?';
                case '`':   return '~';
                case '1':   return '!';
                case '2':   return '@';
                case '3':   return '#';
                case '4':   return '$';
                case '5':   return '%';
                case '6':   return '^';
                case '7':   return '&';
                case '8':   return '*';
                case '9':   return '(';
                case '0':   return ')';
                case '-':   return '_';
                case '=':   return '+';
                default:    return ' ';
            }
        }
    }
    // Public methods
    this.map = function(mod, desc, type, flags) {
        this[mod]         = {};
        this[mod].type    = type;
        this[mod].desc    = desc;
        this[mod].flags   = flags;
        this[mod].caption = '';

        if (flags & F_PRE)            this[mod].caption += '•';
        if (mod.indexOf('ctrl') > -1) this[mod].caption += '^';
        if (mod == 'shift')           this[mod].caption += shifted(key);
        else                          this[mod].caption += key;
        if (flags & F_POS)            this[mod].caption += '•';

        return this;
    }
}

FUNCS['q'] = new Mapping('q')
                .map('default',  'record macro',          T_MCR,  F_POS)
                .map('shift',    'ex mode',               T_CMD)
                .map('ctrl',     'block select',          T_CMD)
                ;
FUNCS['w'] = new Mapping('w')
                .map('default',  'word',                  T_MOV)
                .map('shift',    'WORD',                  T_MOV)
                .map('ctrl',     'window',                T_CMD,  F_POS)
                .map('i_ctrl',   'delete word',           T_OPR)
                ;
FUNCS['e'] = new Mapping('e')
                .map('default',  'end word',              T_MOV)
                .map('shift',    'end WORD',              T_MOV)
                .map('ctrl',     'scroll line ↑',         T_MOV)
                .map('i_ctrl',   'copy char from below',  T_CMD)
                ;
FUNCS['r'] = new Mapping('r')
                .map('default',  'replace char',          T_CMD)
                .map('shift',    'replace',               T_INS)
                .map('ctrl',     ':redo',                 T_CMD)
                .map('i_ctrl',   'insert from register',  T_CMD)
                ;
FUNCS['t'] = new Mapping('t')
                .map('default',  'until char →',          T_FND,  F_POS)
                .map('shift',    'until char ←',          T_FND,  F_POS)
                .map('ctrl',     'ctags return',          T_TAG)
                .map('i_ctrl',   'indent',                T_CMD)
                ;
FUNCS['y'] = new Mapping('y')
                .map('default',  'yank',                  T_OPR,  F_POS | F_PRE)
                .map('shift',    'yank line',             T_CMD)
                .map('ctrl',     'scroll line ↓',         T_MOV)
                .map('i_ctrl',   'copy char from above',  T_CMD)
                ;
FUNCS['u'] = new Mapping('u')
                .map('default',  'undo',                  T_CMD)
                .map('shift',    'undo line',             T_CMD)
                .map('ctrl',     'half page ↑',           T_MOV)
                ;
FUNCS['i'] = new Mapping('i')
                .map('default',  '⬑ insert',              T_INS)
                .map('shift',    '⇤ insert',              T_INS)
                ;
FUNCS['o'] = new Mapping('o')
                .map('default',  'open ↓',                T_INS)
                .map('shift',    'open ↑',                T_INS)
                .map('ctrl',     'prev. mark',            T_MOV)
                ;
FUNCS['p'] = new Mapping('p')
                .map('default',  'paste ↓',               T_CMD)
                .map('shift',    'paste ↑',               T_CMD)
                .map('i_ctrl',   'select ↑',              T_MOV)
                ;
FUNCS['\\['] = new Mapping('[')
                .map('default',  'misc',                  T_MOV,  F_POS)
                .map('shift',    'paragraph ↖',           T_MOV)
                .map('i_ctrl',   'normal',                T_CMD)
                ;
FUNCS['\\]'] = new Mapping(']')
                .map('default',  'misc',                  T_MOV,  F_POS)
                .map('shift',    'paragraph ↘',           T_MOV)
                .map('ctrl',     'jump to tag',           T_TAG)
                ;
FUNCS['\\\\'] = new Mapping('\\')
                .map('default',  'leader',                undefined,  F_POS)
                .map('shift',    '⇤ goto col0',           T_MOV)
                ;

function update(mod) {
    var tpl_key = _.template($('#tpl_key').html());

    $('.keyboard kbd').removeClass();

    for (key in FUNCS) {
        if ( ! FUNCS[key][mod]) {
            $('.keyboard kbd#key_' + key)
                .html(tpl_key({'caption':key, 'desc': null}));
            continue;
        }

        $('.keyboard kbd#key_' + key)
            .addClass('type_'+FUNCS[key][mod].type)
            .html(tpl_key(FUNCS[key][mod]));
    }

}

var MODE = 'normal';

$(function(){
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    update('default');

    $(window).on('keydown', function(e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
            //case 73: update('insert'); MODE = 'insert';
            case 16: update('shift');   break;
            case 17: 
                if (MODE == 'insert')    update('i_ctrl');
                else                    update('ctrl');
                break;
            case 27: update('default'); MODE = 'normal';break;
        }
    })
});
