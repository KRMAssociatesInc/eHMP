::: page-description
Testing
=======
:::

## Unit Tests

 * [Mocha](http://mochajs.org/) is the current unit testing and integration testing framework.
 * [Must.js](https://github.com/moll/js-must) is the assertion library.
 * [Sinon.js](http://sinonjs.org/) is the spy library.

Run unit tests and integration tests from the `/rdk/product/production/rdk/` directory.
 * `npm test` runs the unit tests. `npm test` is an ailas for `npm run test:unit`.
 * `npm run test:integration` will run the integration tests when the integration test framework is ready.
 * To run a single unit test file, run `./node_modules/.bin/mocha --require ./test-helpers/mocha-helper.js ./test-helpers/sinon-helper.js ./path/to/test/file-spec.js`.

Run the writeback integration tests from the `/rdk/product/production/rdk/write` directory.
 * `npm run int-test` runs the writeback integration tests.

Mocha's Behavior-Driven Development (BDD) interface is used, which provides `describe` and `it`. For example:
```JavaScript
describe('string letter counter', function() {
    it('returns an error when the argument is not a string', function() {
        var letters = countLetters({});
        expect(result).to.be.an(Error);
    });
    it('counts the number of occurrences of letters in a string', function() {
        var letters = countLetters('book');
        expect(letters).to.eql({
            b: 1,
            o: 2,
            k: 1
        });
    });
});
```


### Unit Test and Integration Test Guidelines
 * All unit test files and integration test files should be placed directly next to the file they test.
 * Unit test filenames should be the same as the file they test, with `-spec` appended before `.js`.
    * For example, the file which unit tests `notes-validator.js` should be named `notes-validator-spec.js`.
 * Integration test filenames should have `-itest-spec.js` appended before `.js`.
 * Avoid printing anything to stdout in a unit test until there's a way to suppress output for passed tests.
 * Unit tests should not require any servers running to pass.
 * Integration tests may only test integration with one server at a time.
 * `describe` blocks can be nested. `describe` strings should specify what is being tested.
 * `it` strings should either:
    * declaratively describe the expected behavior of the item being tested for a given input, or
    * follow the 'should {x}' formula
 * `it` strings should not end with a period.
 * The concatenation of the `describe` and `it` strings for a test should form a full sentence.
 * Avoid checking if anything is undefined; assigning a variable to be undefined is explicitly against the [style guide](style-guide.md).

### Jasmine to Mocha
Jasmine comes with batteries included and Mocha expects you to bring your own libraries for assertion and spying. Read the documentation for Mocha, Must, and Sinon from the links at the top of the page for more detail. Below is a quick migration guide which may help you know what to look for.

#### Mocha
Mocha tests are made asynchronous by accepting the `done` callback parameter.
The default timeout for Mocha tests is 2000ms. The timeout for a test can be modified with `this.timeout()`.

```JavaScript
it('should do something asynchronously with Jasmine', function() {
    var done = false;
    var result;
    doAsynchronousThing(function callback(res) {
        result = res;
        done = true;
    });
    waitsFor(function() {
        return done;
    }, 1000);
    runs(function() {
        expect(result).toBe('abc');
    });
});
it('should do something asynchronously with Mocha', function(done) {
    this.timeout(1000);
    doAsynchronousThing(function callback(result) {
        expect(result).to.equal('abc');
        done();
    });
});
```

#### Sinon
Sinon differentiates between 2 concepts that Jasmine treats as 1 concept:
 * Sinon spies track usage of a function. If a function is spied on, the function runs.
 * Sinon stubs are spies with extra functionality to modify the behavior of the function.

```JavaScript
var spy = jasmine.createSpy();  // Jasmine
var spy = sinon.spy();  // Sinon (Mocha)

spyOn(myObject, 'myMethod');  // Jasmine
sinon.stub(myObject, 'myMethod');  // Sinon (Mocha)

spyOn(myObject, 'myMethod').andCallThrough();  // Jasmine
sinon.spy(myObject, 'myMethod');  // Sinon (Mocha)

spyOn(myObject, 'myMethod').andCallFake(function() {});  // Jasmine
sinon.stub(myObject, 'myMethod', function() {});  // Sinon (Mocha)

jasmine.any(Function)  // Jasmine
sinon.match.func  // Sinon (Mocha)

expect(spy).toHaveBeenCalled();  // Jasmine
expect(spy.called).to.be.true();  // Sinon (Mocha)

expect(spy).toHaveBeenCalledWith('arg1', 'arg2');  // Jasmine
expect(spy.calledWith('arg1', 'arg2')).to.be.true();  // Sinon (Mocha)
```

#### Must
 * Must's API favors unambiguity. For example, the difference between Jasmine's `toBe` and `toEqual` is ambiguous. The equivalent functions provided by Must are not ambiguous: `to.equal` is a strict equality comparison (like `===`), and `to.eql` is a loose equality comparison (like `==`).
 * Must allows for matchers to be written in a fluent way by having pass-through properties like `to`, `be`, `a`, etc, which do not influence the assertion, but make the assertion read like natural language.
 * Must contains various matchers to check for built-in JavaScript types, like `null()`, `error()`, `date()`, `regexp()`, and more. Custom types may be checked with `a()` or `an()`.
 * Must inverts assertions with the chaining `not` property.

```JavaScript
expect(result).toBe('yes');  // Jasmine
expect(result).to.equal('yes');  // Must (Mocha)

expect(result).toBe(false);  // Jasmine
expect(result).to.be.false();  // Must (Mocha)

expect(result).toNotBe('abc');  // Jasmine
expect(result).not.to.equal('abc');  // Must (Mocha)

expect(result).toBeTruthy();  // Jasmine
expect(result).to.be.truthy();  // Must (Mocha)

expect(result).toBeGreaterThan(5);  // Jasmine
expect(result).to.be.above(5);  // Must (Mocha)

expect(result).toEqual({ foo: { bar: 'baz' } });  // Jasmine
expect(result).to.eql({ foo: { bar: 'baz' } });  // Must (Mocha)

expect(result).toEqual(jasmine.any(Number));  // Jasmine
expect(result).to.be.a.number();  // Must (Mocha)

expect(result).toEqual(jasmine.any(MyClass));  // Jasmine
expect(result).to.be.a(MyClass);  // Must (Mocha)
```

| Jasmine                | Mocha                 | Notes             |
|------------------------|-----------------------|-------------------|
| toBe                   | to.equal              |                   |
| toEqual                | to.eql                |                   |
| toBeCloseTo            |                       | use to.be.between |
| toBeFalsy              | to.be.falsy           |                   |
| toBeTruthy             | to.be.truthy          |                   |
| toBeDefined            | not.to.be.undefined   |                   |
|                        | to.exist              |                   |
| toBeUndefined          | to.be.undefined       |                   |
| toBeNull               | to.be.null            |                   |
| toBeGreaterThan        | to.be.gt              | or to.be.above    |
|                        | to.be.gte             | or to.be.at.least |
| toBeLessThan           | to.be.lt              | or to.be.below    |
|                        | to.be.lte             | or to.be.at.most  |
| toBeNaN                | to.be.nan             |                   |
| toContain              | to.contain            |                   |
|                        | to.be.empty           |                   |
| toMatch                | to.match              |                   |
| toThrow                | to.throw              |                   |
| toHaveBeenWith         |                       | use Sinon         |
| toHaveBeenCalledWith   |                       | use Sinon         |
| toHaveBeenCalledTimes  |                       | use Sinon         |


## Acceptance Tests

[Cucumber](https://cukes.info/) is the current acceptance testing framework.

Acceptance tests are found in the `/rdk/product/production/tests/acceptance-tests` directory.

<br />
---
Return: [Index](index.md)
