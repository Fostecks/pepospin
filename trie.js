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

    remove(channel) {
        let curr = this.root;
        let chars = channel.split('');

        let collapse = this._remove(chars, curr);

        if (collapse) {
            delete curr[Object.keys(curr)[0]];
        }
    }

    _remove(chars, curr, collapse) {
        let c = chars.shift();
        curr = curr[c];

        if (chars.length > 0) {
            collapse = this._remove(chars, curr, collapse);
        }

        if (collapse === true) {
            if (curr.end) {
                return false;
            }
            delete curr[Object.keys(curr)[0]];
            return true;
        }

        if (collapse === false) {
            return false;
        }

        if (collapse === undefined) {
            delete curr.end;
        }

        if (!collapse && Object.keys(curr).length === 0) {
            return true;
        } else {
            return false;
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

    isEmpty() {
        return Object.keys(this.root).length === 0;
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
