/** An implementation of red-black tree */
const {Tree} = require('../internal/tree');
/** Classes that regulate whether tree nodes hold keys only, or key-value pairs */
const {KeyOnlyPolicy} = require('../internal/policies');
/** Node for a red-black tree */
const {TreeNode} = require('../internal/tree-node');

/**
 * TreeSet is a container that stores unique elements following a specific order.
 *
 * In a TreeSet, the value of an element also identifies it (the value is itself the key),
 * and each value must be unique. The value of the elements in a TreeSet cannot be modified
 * once in the container (the elements are immutable), but they can be inserted or removed
 * from the container.
 *
 * ## Container properties
 * * **Associative** - Elements in associative containers are referenced by their key and
 * not by their absolute position in the container.</li>
 * * **Ordered** - The elements in the container follow a strict order at all times.
 * All inserted elements are given a position in this order.</li>
 * * **Set** - The value of an element is also the key used to identify it.</li>
 * * **Unique keys** - No two elements in the container can have equivalent keys.</li>
 *
 *
 * @example
 * let set = new TreeSet();
 * // add few values
 * set.add(1);
 * set.add(2);
 * // check whether key exists
 * let flag = set.has(1); // << true
 * // print all keys
 * for (let key of set) {
 *   console.log(`key: ${key}`);
 * }
 */
class TreeSet {
    /*======================================================
     * Methods of ES6 Set
     *======================================================*/

    /**
     * Creates an empty, or a pre-initialized set.
     * @param {*} [iterable] Another iterable object whose values are added into the newly created set.
     * @example
     * // Create an empty set
     * let set = new TreeSet();
     * // Create and initialize set
     * let set2 = new TreeSet([1, 2, 3]);
     */
    constructor(iterable) {
        /** Internal tree */
        this.__t = new Tree();
        this.__t.valuePolicy = new KeyOnlyPolicy();
        if ((iterable !== undefined)
            && (iterable !== null)) {
            if (iterable[Symbol.iterator] !== undefined) {
                // copy contents
                for (let k of iterable) {
                    this.add(k);
                }
            }
            else {
                throw new Error('TreeSet constructor accepts only iterable objects');
            }
        }
    }

    /**
     * String tag of this class
     * @returns {String}
     * @example
     * Object.prototype.toString.call(new TreeSet()); // "[object TreeSet]"
     */
    get [Symbol.toStringTag]() {
        return 'TreeSet';
    }

    /**
     * Allows to create programmatically an instance of the same class
     * @returns constructor object for this class.
     * @example
     * let set = new TreeSet();
     * let constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
     * let set2 = new constrFunc();
     */
    static get [Symbol.species]() {
        return TreeSet;
    }

    /**
     * Removes all key-value pairs.
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * set.clear();
     * console.log(set.size); // 0
     */
    clear() {
        this.__t.clear();
    }

    /**
     * Removes key-value pair with the specified key if such entry exists. Does nothing otherwise.
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * set.delete(2);
     * console.log(set.toString()); // {1,3}
     */
    delete(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            this.__t.erase(it.node);
        }
    }

    /**
     * Forward ES6 iterator for all values in ascending order.
     * @returns {JsIterator}
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * for (let key of set.entries()) {
     *   console.log(`key: ${key}`);
     * }
     */
    entries() {
        return this.__t.entries();
    }

    /**
     * Iterates all values using a callback in ascending order.
     * Note that ES6 specifies the order of key parameters in the callback differently from for-of loop.
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * set.forEach(function(value, key, container) {
     *   // value is the same as key
     *   console.log(`key: ${key}, value: ${value}`);
     * });
     */
    forEach(callback) {
        for (let k of this.__t) {
            callback(k, k, this);
        }
    }

    /**
     * A boolean indicator whether set contains the specified key.
     * @returns {Boolean}
     * @param {*} key a value of any type that can be compared with a key
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * let b = set.get(3); // true
     * b = set.get(4); // false
     */
    has(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Forward ES6 iterator for all keys in ascending order.
     * @returns {JsIterator}
     * @example
     * // iterate all keys
     * let set = new TreeSet([1, 2, 3]);
     * for (let k of set.keys()) {
     *   console.log(k); // 1, 2, 3
     * }
     * // iterate all keys in reverse order
     * let set = new TreeSet([1, 2, 3]);
     * for (let k of set.keys().backward()) {
     *   console.log(k); // 3, 2, 1
     * }
     */
    keys() {
        return this.__t.keys();
    }

    /**
     * Adds a key to the set, unless the key already exists.
     * @param {*} key
     * @example
     * let set = new TreeSet();
     * set.add(1);
     */
    add(key) {
        let n = new TreeNode();
        n.key = key;
        this.__t.insertUnique(n);
    }

    /**
     * Number of keys in the set.
     * @returns {Number}
     */
    get size() {
        return this.__t.size();
    }

    /**
     * Forward ES6 iterator for all keys in ascending order. It is the same as keys() method
     * @returns {JsITerator}
     * @example
     * // iterate all values
     * let set = new TreeSet([1, 2, 3]);
     * for (let v of set.values()) {
     *   console.log(v); // '1', '2', '3'
     * }
     * // iterate all values in reverse order
     * let set = new TreeSet([1, 2, 3]);
     * for (let v of set.values().backward()) {
     *   console.log(v); // '3', '2', '1'
     * }
     */
    values() {
        return this.__t.keys();
    }

    /**
     * Forward ES6 iterator for all keys in ascending order. The same as entries() method
     * @returns {JsIterator}
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * for (let key of set) {
     *   console.log(`key: ${key}, value: ${value}`);
     * }
     */
    [Symbol.iterator]() {
        return this.__t[Symbol.iterator]();
    }

    /*======================================================
     * More methods
     *======================================================*/
    /**
     * ES6 reverse iterator for all keys in descending order.
     * @returns {JsReverseIterator}
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * for (let key of set.backwards()) {
     *   console.log(`key: ${key}`);
     * }
     */
    backward() {
        return this.__t.backward();
    }

    /**
     * Sets custom comparison function if key values are not of primitive types.
     * Callback is a 3-way comparison function accepts two key values (lhs, rhs). It is expected to return
     *      +1 if the value of rhs is greater than lhs
     *      -1 if the value of rhs is less than lhs
     *       0 if values are the same
     */
    set compareFunc(func) {
        this.clear();
        this.__t.compare = func;
    }

    /*======================================================
     * STL-like methods
     *======================================================*/

    /**
     * Forward iterator to the first element
     * @returns {Iterator}
     * @example
     * let set = new TreeSet();
     * ...
     * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    begin() {
        return this.__t.begin();
    }

    /**
     * Forward iterator to the element following the last element
     * @returns {Iterator}
     * @example
     * let set = new TreeSet();
     * ...
     * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    end() {
        return this.__t.end();
    }

    /**
     * Finds an element with key equivalent to the specified one. If such key does not exist end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * ...
     * let it = set.find(1);
     * if (!it.equals(set.end())) {
     *   console.log(`Found key: ${it.key}`); // 1
     * }
     */
    find(key) {
        return this.__t.find(key);
    }

    /**
     * Adds a key if it doesn't exist
     * @param {*} key
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     * @example
     * let set = new TreeSet();
     * let res = set.insertUnique(1);
     * if (res.wasInserted) {
     *   console.log(`Inserted ${res.iterator.key}`); // prints 1
     * }
     * res = set.insertUnique(1); // this step has no effect on the set
     * if (res.wasInserted) {
     *   console.log(`Inserted ${res.iterator.key}`); // not executed
     * }
     */
    insertUnique(key) {
        let n = new TreeNode();
        n.key = key;
        return this.__t.insertUnique(n);
    }

    /**
     * Adds key-value pair if such key does not exist in the map. Replaces value if such key exists
     * @param {*} key
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     * @example
     * let set = new TreeSet();
     * let res = set.insertOrReplace(1);
     * if (res.wasInserted) {
     *   console.log(`Inserted ${res.iterator.key}`); // prints 1
     * }
     * res = set.insertOrReplace(1) // returns iterator to the previously added node
     * if (res.wasInserted) {
     *   console.log(`Inserted ${res.iterator.key}`); // prints 1
     * }
     */
    insertOrReplace(key) {
        let n = new TreeNode();
        n.key = key;
        return this.__t.insertOrReplace(n);
    }

    /**
     * Removes value for the specified iterator.
     * @param {Iterator} iterator
     * @example
     * let set = new TreeSet([1,2,3]);
     * let it = set.find(2);
     * it.prev();
     * set.erase(it); // removes a node with key 1
     * console.log(set.toString()); // {2,3}
     */
    erase(iterator) {
        this.__t.erase(iterator.node);
    }

    /**
     * Iterator pointing to the first element that is not less than specified key. If no such element is found, see end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let set = new TreeSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = set.lowerBound(0);
     * let to = set.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let set = new TreeSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(set.upperBound(50));
     * let to = new ReverseIterator(set.lowerBound(0));
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    lowerBound(key) {
        return this.__t.lowerBound(key);
    }

    /**
     * Reverse iterator to the last element.
     * @returns {ReverseIterator}
     * @example
     * let set = new TreeSet();
     * ...
     * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    rbegin() {
        return this.__t.rbegin();
    }

    /**
     * Reverse iterator pointing to before the first element.
     * @returns {ReverseIterator}
     * @example
     * let set = new TreeSet();
     * ...
     * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    rend() {
        return this.__t.rend();
    }

    /**
     * Iterator pointing to the first element that is greater than key. If no such element is found end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let set = new TreeSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = set.lowerBound(0);
     * let to = set.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let set = new TreeSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(set.upperBound(50));
     * let to = new ReverseIterator(set.lowerBound(0));
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    upperBound(key) {
        return this.__t.upperBound(key);
    }

    /**
     * @returns first element of the container, or undefined if container is empty
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * let first = set.first(); // 1
     */
    first() {
        return this.__t.first();
    }

    /**
     * @returns last element of the container, or undefined if container is empty
     * @example
     * let set = new TreeSet([1, 2, 3]);
     * let last = set.last(); // 3
     */
    last() {
        return this.__t.last();
    }

    /**
     * Serializes contents of the set in the form {key1,key2,...}
     * @returns {String}
     */
    toString() {
        return this.__t.toString();
    }
}

module.exports = {
    TreeSet: TreeSet,
};