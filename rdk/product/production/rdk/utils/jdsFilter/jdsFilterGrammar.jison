/*
Try interactively:
http://nolanlawson.github.io/jison-debugger/
http://zaach.github.io/jison/try/
eq("foo","bar"),and(in(ping,"pong"),or(ne("error","1"),gt("count","max"))),eq("baz","quux",foo,),in(siteCode,[500,DOD,"400"])
*/

%lex

DoubleStringCharacter ([^\"])|(\"\")
StrayStringCharacter [a-zA-Z0-9]
StringLiteral (\"{DoubleStringCharacter}*\")|({StrayStringCharacter}+)

%options flex
%%

"eq" return 'eq'
"in" return 'in'
"ne" return 'ne'
"exists" return 'exists'
"nin" return 'nin'
"gt" return 'gt'
"lt" return 'lt'
"gte" return 'gte'
"lte" return 'lte'
"between" return 'between'
"like" return 'like'
"ilike" return 'ilike'

"(" return '('
")" return ')'
"[" return '['
"]" return ']'
"and" return 'and'
"or" return 'or'
"not" return 'not'
"," return ','

{StringLiteral} return 'STRING_LITERAL'

/lex

%start filtersOptionalTrailingComma
%%

optionalComma
    : ',' | /* no comma */
    ;

list
    :   "[" arguments "]"
        { $$ = $arguments; }
    ;

argument
    :   list
    |   STRING_LITERAL
    ;

arguments
    :   arguments ',' argument
        { $arguments.push($argument); $$ = $arguments; }
    |   argument
        { $$ = [$argument]; }
    ;

argumentsOptionalTrailingComma
    :   arguments optionalComma
        { $$ = $arguments; }
    ;

functionOperator
    :   'eq'|'in'|'ne'|'exists'|'nin'|'gt'|'lt'|'gte'|'lte'|'between'|'like'|'ilike'
    ;

function
    :   functionOperator '(' argumentsOptionalTrailingComma ')'
        { $$ = [$functionOperator].concat($argumentsOptionalTrailingComma); }
    ;

groupOperator
    :   'and'|'or'|'not'
    ;

filter
    :   groupOperator '(' filters ')'
        { $$ = [$groupOperator].concat($filters); }
    |   function
        { $$ = $function; }
    ;

filters
    :   filters ',' filter
        { $filters.push($filter); $$ = $filters; }
    |   filter
        { $$ = [$filter]; }
    ;

filtersOptionalTrailingComma
    :   filters optionalComma
        { $$ = $filters; return $$; }
    ;
