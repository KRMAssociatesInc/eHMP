::: page-description
JDS filters
===========
:::

Limit the response size of JDS fetches by only fetching what you need with the JDS REST API `filter` query parameter.
The `filter` query parameter may contain one or more operators. If the evaluation of all operators on the item is true, that item is included in the response body.

Separate operators with commas and/or spaces. There may be an optional trailing comma.
The `filter` operators accept double-quoted strings and unquoted strings as arguments. Use double-quoted strings when the argument contains non-alphanumeric characters.

An implicit `and` group surrounds the entire filter query parameter.


## Grouping Operators

 * `and(operators)`
 * `or(operators)`
 * `not(operators)`

Grouping operators can be nested. For example, `or(and(eq("foo","bar"),like("baz","quux")),in("ping","pong"))`

An implicit `and` group surrounds the entire filter query parameter. For example, the following 2 filter query parameters are equivalent:

 * `    filter=eq("facilityCode","DOD"),eq("specimen","PLASMA")`
 * `filter=and(eq("facilityCode","DOD"),eq("specimen","PLASMA"))`


## Comparison Operators

Comparison operators take arguments inside parentheses. The first argument is always what JDS field to inspect and the second argument is what value to check for.
Arguments can't be empty. Lists are comma-separated items that start with `[` and end with `]`

NOTE: all JDS filters must be submitted to JDS URI-encoded. The following examples are not URI-encoded.
The recommended way of URI-encoding query parameters in RDK is with the querystring library; see documentation for `querystring.stringify()`.

Operator:
 * `eq` ("equals")
    * exact comparison
    * arguments: field, value
    * example: `eq(siteCode,"DOD")`
 * `ne` ("not equals")
    * exact comparison
    * arguments: field, value
    * example: `ne(siteCode,"DOD")`
 * `in` ("inside list")
    * exact comparison within list
    * arguments:  field, list of values
    * example: `in(siteCode,["DOD","500"])`
 * `nin` ("not inside list")
    * exact comparison within list
    * arguments: field, list of values
    * example: `nin(siteCode,["DOD","500"])`
 * `exists` ("exists")
    * arguments: field
    * example: `exists(siteCode)`
 * `gt` ("greater than")
    * arguments: field, value
    * example: `gt(observed,20130507)`
 * `gte` ("greater than or equal")
    * arguments: field, value
    * example: `gte(observed,20130507)`
 * `lt` ("lesser than")
    * arguments: field, value
    * example: `lt(observed,20130507)`
 * `lte` ("lesser than or equal")
    * arguments: field, value
    * example: `lte(observed,20130507)`
 * `between` ("between")
    * exclusive
    * arguments: field, low, high
    * example: `between(observed,20130501,20130601)`
 * `like` ("like")
    * M pattern match, % is a wildcard
    * arguments: field, value
    * example: `like(kind,"%NOTE")`
 * `ilike` ("like, case insensitive")
    * M pattern match, % is a wildcard
    * arguments: field, value
    * example: `ilike(kind,"%note")`


## Filter Fields

The field argument of a comparison operator is similar to accessing a property on a JavaScript object.
A top-level field is selected for comparison by its name.
A nested field is selected for comparison with dot notation.
Select fields of objects in an array by putting [] after the array's field name.

Examples:
 * `siteCode` - compares the top-level siteCode field
 * `exposure[].name` - compares the name field of each object in the top-level exposure array
 * `primaryProvider.role` - compares the role field of the top-level primaryProvider object
