window.addEventListener('DOMContentLoaded', function() {
    var pathKey = "source_dashboard",
        nameKey = "name",
        separator = "_";

    var segmentData = dataset.filter(function(item) {
        if (!item[pathKey]) return false;
        return item[pathKey].indexOf('segment') === 0;
    });

    function getId() {
        return Math.ceil(Math.random() * 100000);
    }

    function find(array, fn) {
        var i = 0, len = array.length;
        for (; i < len; i += 1) if (fn(array[i])) return array[i];
        return null;
    }

    function parsePath(path) { return path.split(separator).slice(1); }

    function parseTreeLevel(tree, item, path) {
        var treelevel = find(tree, function(l) { return l.title === path[0]; });
        if (!treelevel) {
            treelevel = { id: getId(), title: path[0] };
            tree.push(treelevel);
        }
        if (path.length === 1) {
            treelevel.model = item;
        } else {
            treelevel.nodes = parseTreeLevel(treelevel.nodes || [], item, path.slice(1));
        }
        return tree;
    }

    function putInTree(tree, item) {
        return parseTreeLevel(tree, item, parsePath(item[pathKey]));
    }

    var result = segmentData.reduce(putInTree, []);

    var tree = new BackTree.Tree({
        collection : result
    });

    $('#app').append(tree.render().$el);
});
