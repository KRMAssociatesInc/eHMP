jds-filter.js
=============

jds-filter.js can:
 * parse JDS filter queries into JavaScript objects
 * build those JavaScript objects back into JDS filter query strings
 * apply JDS filter objects to an array of items


## Parsing and Building

 * `var filterObject = jdsFilter.parse(filterString);`
 * `var filterString = jdsFilter.build(filterObject);`

All JDS filters must be submitted to JDS URI-encoded. The JDS filter strings built by this library are not URI-encoded.
The recommended way of URI-encoding query parameters in Node.js is with the querystring library; see documentation for `querystring.stringify()`.
Various client-side frameworks have their own way of serializing query strings.

JDS filter objects look like:
```JavaScript
[
  ['between', 'observedDate', '20140830', '20140930'],
  ["or",
    ['in', 'facilityCode', ['9E7A', 'C877']],
    ['eq', 'status', 'ACTIVE']
  ]
]
```
The equivalent JDS query string would look like:
```
between("observedDate","20140830","20140930"),
or(
  in("facilityCode",["9E7A","C877"]),
  eq("status","ACTIVE")
  )
```

JDS filter object operator expressions are arrays, where the first element is the operator, and the following elements are the operator's arguments. Group operators may take any set of operators as arguments, and group operators can be nested.

An implicit `and` group surrounds the entire filter query parameter.


### Operator Detail

The following comparison operators exist:
 * `eq` "equals", exact comparison
    * arguments: field, value
 * `ne` "not equals", exact comparison
    * arguments: field, value
 * `in` "inside list", exact comparison within list
    * arguments:  field, list of values
 * `nin` "not inside list" exact comparison within list
    * arguments: field, list of values
 * `exists` "exists"
    * arguments: field
 * `gt` "greater than"
    * arguments: field, value
 * `gte` "greater than or equal"
    * arguments: field, value
 * `lt` "lesser than"
    * arguments: field, value
 * `lte` "lesser than or equal"
    * arguments: field, value
 * `between` "between", exclusive
    * arguments: field, low, high
 * `like` "like", M pattern match, % is a wildcard
    * arguments: field, value
 * `ilike` "like, case insensitive", M pattern match, % is a wildcard
    * arguments: field, value

The following grouping operators exist:
 * `and`
 * `or`
 * `not`


The field argument of a comparison operator is similar to accessing a property on a JavaScript object.
A top-level field is selected for comparison by its name.
A nested field is selected for comparison with dot notation.
Select fields of objects in an array by putting [] after the array's field name.

Examples:
 * `siteCode` - compares the top-level siteCode field
 * `exposure[].name` - compares the name field of each object in the top-level exposure array
 * `primaryProvider.role` - compares the role field of the top-level primaryProvider object


## Applying Filter Objects

 * `var filteredItems = jdsFilter.applyFilters(filterObject, items);`

If the filter expression evaluates to true for an item, that item is included in the result.


