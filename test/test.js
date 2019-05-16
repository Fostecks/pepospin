const assert = require('assert');
const Trie = require('../trie.js');

describe('Trie', function () {

    describe('constructor', function() {

        it('accepts an array', function() {
            let trie = new Trie(['cat']);
            assert.deepStrictEqual(trie.find('cat'), ['cat']);
        });

        it('does not work with non-arrays', function() {
            let trie = new Trie('cat');
            assert.deepStrictEqual(trie.find('cat'), []);
        });

        it('can take 0 arguments', function() {
            let trie = new Trie();
            assert.deepStrictEqual(trie.find('cat'), []);
        });
    });

    describe('add', function() {

        it('works', function() {
            let trie = new Trie();
            assert.deepStrictEqual(trie.find('cat'), []);
            trie.add('cat');
            assert.deepStrictEqual(trie.find('cat'), ['cat']);
        });
    });

    describe('remove', function() {
       
        it('works in simple cases', function() {
            let trie = new Trie(['cat']);
            assert.deepStrictEqual(trie.find('cat'), ['cat']);
            trie.remove('cat');
            assert.deepStrictEqual(trie.find('cat'), []);
        });

        describe('complex cases', function() {

            let trie;

            beforeEach(function() {
                trie = new Trie(['cat', 'cats', 'catsushi']);
            });

            it('removes a shortest element', function() {
                trie.remove('cat');
                let result = trie.find('c');
                assert(result.length === 2);
                assert(result.includes('cats'));
                assert(result.includes('catsushi'));
            });

            it('removes a middle element', function() {
                trie.remove('cats');
                let result = trie.find('c');
                assert(result.length === 2);
                assert(result.includes('cat'));
                assert(result.includes('catsushi'));
            });

            it('removes a longest element', function() {
                trie.remove('catsushi');
                let result = trie.find('c');
                assert(result.length === 2);
                assert(result.includes('cat'));
                assert(result.includes('cats'));
            });
        });
    });

    describe('find', function() {

        let trie;

        before(function() {
            trie = new Trie(['cat', 'cap', 'code', 'cats']);
        });

        it('matches from exact input', function() {
            assert.deepStrictEqual(trie.find('cap'), ['cap']);
        });

        it('matches from a prefix', function() {
            assert.deepStrictEqual(trie.find('co'), ['code']);
        });

        it('is able to return no matches', function() {
            assert.deepStrictEqual(trie.find('d'), []);
        });

        it('matches multiple', function() {
            let result = trie.find('cat');
            assert(result.includes('cat'));
            assert(result.includes('cats'));
        });
    });

    describe('isEmpty', function() {

        it('works', function() {
            let trie = new Trie();
            assert(trie.isEmpty());
            trie.add('cat');
            assert(!trie.isEmpty());
            trie.remove('cat');
            assert(trie.isEmpty());
        });
    });

    it('supports emoji', function() {
        let trie = new Trie(['yacht-rock-🛥']);
        assert.deepStrictEqual(trie.find('yacht'), ['yacht-rock-🛥']);
        trie.add('🤠-howdy-🤠');
        assert.deepStrictEqual(trie.find('🤠'), ['🤠-howdy-🤠']);
        trie.remove('🤠-howdy-🤠');
        assert.deepStrictEqual(trie.find('🤠'), []);
    });
});
