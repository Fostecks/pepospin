class Trie {
    
    constructor(channels) {
        this.root = {};
        if (!channels) return;
        for (let channel of channels) {
            this.add(channel);
        }
    }

    add(channel) {
        let curr = this.root;
        let chars = channel.split('');

        for (let i = 0; i < chars.length; i++) {
            let c = chars[i];

            if (!curr[c]) {
                curr[c] = {};
            }

            if (i == chars.length - 1) {
                curr[c]['end'] = true;
                break;
            }

            curr = curr[c];
        }
    }

    find(prefix) {
        let curr = this.root;

        for (let x of prefix.split('')) {
            if (!curr[x]) {
                return [];
            }
            curr = curr[x];
        }

        return this._search(prefix, curr);
    }

    _search(prefix, curr) {
        let result = [];
        let stack = [];

        Object.keys(curr).forEach(e => stack.push(e));

        while(stack.length > 0) {
            let x = stack.pop();
            if (x === 'end') {
                result.push(prefix);
            } else {
                this._search(prefix + x, curr[x]).forEach(e => result.push(e));
            }
        }

        return result;
    }
}

module.exports = Trie;
