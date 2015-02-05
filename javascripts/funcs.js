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

var SHIFTS = {
    '[':  '{',  ']':  '}',  '\\':  '|',  ';':  ':',  '\'':  '"',  ',':  '<',
    '.':  '>',  '/':  '?',  '`':  '~',  '1':  '!',  '2':  '@',  '3':  '#',
    '4':  '$',  '5':  '%',  '6':  '^',  '7':  '&',  '8':  '*',  '9':  '(',
    '0':  ')',  '-':  '_',  '=':  '+'
};

var current_mode,
    current_key;

var tpl_key;

var modeline_texts = {'': 'NORMAL', 'i_': 'INSERT', 'v_': 'VISUAL', 'r_': 'REPLACE'};

function Mapping(key) {

    // Private methods
    var shifted = function(key) {
        if (key.match(/[a-zA-Z]/)) return key.toUpperCase();
        else                          return SHIFTS[key] || ' ';
    }

    // Public members
    this.default_caption = key;

    // Public methods
    this.map = function(mod, type, desc, flags) {
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



FUNCS['BACKTICK'] = new Mapping('`')
                .map('',          T_MOV,  'goto mark',                F_POS)
                .map('shift',            T_CMD,  'toggle case')
                ;
FUNCS['1'] = new Mapping('1')
                .map('shift',            T_OPR,  'extern filter')
                ;
FUNCS['2'] = new Mapping('2')
                .map('shift',            T_MCR,  'play macro', F_POS)
                ;
FUNCS['3'] = new Mapping('3')
                .map('shift',            T_TAG,  'prev id')
                ;
FUNCS['4'] = new Mapping('4')
                .map('shift',            T_MOV,  '⇥')
                ;
FUNCS['5'] = new Mapping('5')
                .map('shift',            T_TAG,  'goto match')
                ;
FUNCS['6'] = new Mapping('6')
                .map('shift',            T_MOV,  'soft ⇤')
                ;
FUNCS['7'] = new Mapping('7')
                .map('shift',            T_CMD,  'repeat :s')
                ;
FUNCS['8'] = new Mapping('8')
                .map('shift',            T_TAG,  'next id')
                ;
FUNCS['9'] = new Mapping('9')
                .map('shift',            T_MOV,  'begin sentence')
                ;
FUNCS['0'] = new Mapping('0')
                .map('',            T_MOV,  'hard ⇤')
                .map('shift',            T_MOV,  'end sentence')
                ;
FUNCS['MINUS'] = new Mapping('-')
                .map('',          T_MOV,  '⬆')
                .map('shift',            T_MOV,  'cur line')
                ;
FUNCS['EQUAL'] = new Mapping('p')
                .map('',          T_OPR,  'autoformat')
                .map('shift',          T_MOV,  '⬇')
                ;
FUNCS['q'] = new Mapping('q')
                .map('',          T_MCR,  'record macro',             F_POS)
                .map('shift',            T_CMD,  'ex mode')
                .map('ctrl',             T_CMD,  'block select')
                ;
FUNCS['w'] = new Mapping('w')
                .map('',          T_MOV,  'word ↘')
                .map('shift',            T_MOV,  'WORD ↘')
                .map('ctrl',             T_CMD,  'window',                   F_POS)
                .map('i_ctrl',           T_OPR,  'delete word')
                ;
FUNCS['e'] = new Mapping('e')
                .map('',          T_MOV,  'end word')
                .map('shift',            T_MOV,  'end WORD')
                .map('ctrl',             T_MOV,  'scroll line ↑')
                .map('i_ctrl',           T_CMD,  'copy char from below')
                ;
FUNCS['r'] = new Mapping('r')
                .map('',          T_CMD,  'replace char')
                .map('shift',            T_INS,  'replace')
                .map('ctrl',             T_CMD,  ':redo')
                .map('i_ctrl',           T_CMD,  'insert from register')
                ;
FUNCS['t'] = new Mapping('t')
                .map('',          T_FND,  'until char →',             F_POS)
                .map('shift',            T_FND,  'until char ←',             F_POS)
                .map('ctrl',             T_TAG,  'ctags return')
                .map('i_ctrl',           T_CMD,  'indent')
                ;
FUNCS['y'] = new Mapping('y')
                .map('',          T_OPR,  'yank',                     F_POS | F_PRE)
                .map('shift',            T_CMD,  'yank line')
                .map('ctrl',             T_MOV,  'scroll line ↓')
                .map('i_ctrl',           T_CMD,  'copy char from above')
                ;
FUNCS['u'] = new Mapping('u')
                .map('',          T_CMD,  'undo')
                .map('shift',            T_CMD,  'undo line')
                .map('ctrl',             T_MOV,  'half page ↑')
                ;
FUNCS['i'] = new Mapping('i')
                .map('',          T_INS,  '⬑ insert')
                .map('shift',            T_INS,  '⇤ insert')
                ;
FUNCS['o'] = new Mapping('o')
                .map('',          T_INS,  'open ↓')
                .map('shift',            T_INS,  'open ↑')
                .map('ctrl',             T_MOV,  'prev. mark')
                ;
FUNCS['p'] = new Mapping('p')
                .map('',          T_CMD,  'paste ↓')
                .map('shift',            T_CMD,  'paste ↑')
                .map('i_ctrl',           T_MOV,  'select ↑')
                ;
FUNCS['\\['] = new Mapping('[')
                .map('',          T_MOV,  'misc',                     F_POS)
                .map('shift',            T_MOV,  'paragraph ↖')
                .map('i_ctrl',           T_CMD,  'normal')
                ;
FUNCS['\\]'] = new Mapping(']')
                .map('',          T_MOV,  'misc',                     F_POS)
                .map('shift',            T_MOV,  'paragraph ↘')
                .map('ctrl',             T_TAG,  'jump to tag')
                ;
FUNCS['\\\\'] = new Mapping('\\')
                .map('',          T_EXT,  'leader',                   F_POS)
                .map('shift',            T_MOV,  '⇤ goto col0')
                ;
FUNCS['a'] = new Mapping('a')
                .map('',          T_INS,  'append ⬏')
                .map('shift',            T_INS,  'Append ⇥')
                .map('ctrl',             T_CMD,  'incr. #')
                ;
FUNCS['s'] = new Mapping('s')
                .map('',          T_INS,  'subst char')
                .map('shift',            T_INS,  'subst line')
                ;
FUNCS['d'] = new Mapping('d')
                .map('',          T_OPR,  'del')
                .map('shift',            T_CMD,  'del ⇥')
                .map('ctrl',             T_MOV,  'half page ↓')
                ;
FUNCS['f'] = new Mapping('f')
                .map('',          T_FND,  'find char →',              F_POS)
                .map('shift',            T_FND,  'find char ←',              F_POS)
                .map('ctrl',             T_MOV,  'page ↓')
                .map('g',                T_COD,  'open file')
                ;
FUNCS['g'] = new Mapping('g')
                .map('',          T_EXT,  'extra',                    F_POS)
                .map('shift',            T_MOV,  'goto eof / goto line#')
                .map('ctrl',             T_MOV,  'page ↓')
                ;
FUNCS['h'] = new Mapping('h')
                .map('',          T_MOV,  '⬅')
                .map('shift',            T_MOV,  'Top screen')
                ;
FUNCS['j'] = new Mapping('j')
                .map('',          T_MOV,  '⬇')
                .map('shift',            T_CMD,  'Join lines')
                ;
FUNCS['k'] = new Mapping('k')
                .map('',          T_MOV,  '⬆')
                .map('shift',            T_CMD,  'man page identifier')
                ;
FUNCS['l'] = new Mapping('l')
                .map('',          T_MOV,  '➡')
                .map('shift',            T_MOV,  'Bottom screen')
                .map('ctrl',             T_CMD,  'redraw')
                ;
FUNCS['SEMICOLON'] = new Mapping('\;')
                .map('',          T_FND,  'next f/F/t/T')
                .map('shift',            T_CMD,  'cmd line')
                ;
FUNCS['APOSTROPHE'] = new Mapping('\'')
                .map('',          T_MOV,  'goto mark ⇤',                F_POS)
                .map('shift',            T_EXT,  'register',                 F_POS)
                ;
FUNCS['z'] = new Mapping('z')
                .map('',          T_EXT,  'extra', F_POS)
                .map('shift',            T_EXT,  'extra', F_POS)
                .map('ctrl',             T_CMD,  'suspend')
                ;
FUNCS['x'] = new Mapping('x')
                .map('',          T_CMD,  'del char →')
                .map('shift',            T_INS,  'del char ←')
                .map('ctrl',             T_CMD,  'decr. #')
                ;
FUNCS['c'] = new Mapping('c')
                .map('',          T_OPR,  'change')
                .map('shift',            T_INS,  'change ⇥')
                .map('ctrl',             T_CMD,  'Normal / Cancel')
                ;
FUNCS['v'] = new Mapping('v')
                .map('',          T_CMD,  'select chars')
                .map('shift',            T_CMD,  'select lines')
                .map('ctrl',             T_CMD,  'block select')
                ;
FUNCS['b'] = new Mapping('b')
                .map('',          T_MOV,  '↖ word')
                .map('shift',            T_MOV,  '↖ WORD')
                .map('ctrl',             T_MOV,  'page ↑')
                ;
FUNCS['n'] = new Mapping('n')
                .map('',          T_FND,  'find "next"')
                .map('shift',            T_FND,  'find "prev"')
                .map('ctrl',             T_MOV,  '↓')
                ;
FUNCS['m'] = new Mapping('m')
                .map('',          T_MOV,  'Middle screen')
                .map('shift',            T_CMD,  'set mark', F_POS)
                ;
FUNCS['COMMA'] = new Mapping(',')
                .map('',          T_FND,  'prev f/F/t/T')
                .map('shift',            T_COD,  'undent')
                ;
FUNCS['DOT'] = new Mapping('.')
                .map('',          T_CMD,  'repeat cmd')
                .map('shift',            T_COD,  'indent')
                ;
FUNCS['SLASH'] = new Mapping('/')
                .map('',          T_FND,  'find ↘')
                .map('shift',            T_FND,  'find ↖')
                ;

function update(mode, key) {
    if (current_mode == mode && current_key == key) return;

    current_mode = mode;
    current_key = key;

    $('.modeline .mode').html(modeline_texts[mode]);
    if (mode == 'r_') mode = 'i_';
    var str = mode + key

    $('.keyboard kbd').removeClass();

    for (k in FUNCS) {
        if ( ! FUNCS[k][str]) {
            $('.keyboard kbd#key_' + k)
                .html(tpl_key({'caption':FUNCS[k].default_caption, 'desc': null}));
            continue;
        }

        $('.keyboard kbd#key_' + k)
            .addClass('type_'+FUNCS[k][str].type)
            .html(tpl_key(FUNCS[k][str]));
    }
}

function update_mode(mode) { return update(mode, current_key); }
function update_key(key) { return update(current_mode, key); }

$(function(){
    // INIT
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
    tpl_key = _.template($('#tpl_key').html());
    update('', '');

    $(window).on('keyup', function(e) {
        switch (e.keyCode) {
            case 16: update_key('');   break;
            case 17: update_key('');    break;
            case 90: update_mode('z'); break;
            case 71: update_mode('g'); break;
            case 27: update_mode(''); break;
            case 73: update_mode('i_'); break;
            case 86: update_mode('v_'); break;
            case 82: update_mode('r_'); break;
        }
    });

    $(window).on('keydown', function(e) {
        switch (e.keyCode) {
            case 16: update_key('shift');   break;
            case 17: update_key('ctrl');    break;
        }
    });
});
