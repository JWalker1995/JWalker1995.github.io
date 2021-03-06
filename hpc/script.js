var foreach_comb = function(base, exp, callback) {
    var recurse = function(i, arr) {
        if (i === exp) {
            callback(arr);
        } else {
            for (var j = 0; j < base; j++) {
                arr[i] = j;
                recurse(i + 1, arr);
            }
        }
    };

    recurse(0, []);
};

var make_table = function(num_symbols, num_msgs, num_rows) {
    var $t = $('<table></table>');
    var num_cols = Math.pow(num_symbols, num_msgs);
    var i = 0;

    while (i < num_msgs) {
        var row = '';
        foreach_comb(num_symbols, num_msgs, function(arr) {
            row += '<td>' + arr[i] + '</td>';
        });
        $t.append('<tr>' + row + '</tr>');
        i++;
    }

    var $errors = $();

    while (i < num_rows) {
        var $row = $('<tr></tr>');
        let row_i = i;

        foreach_comb(num_symbols, num_msgs, function(arr) {
            var $td = $('<td contenteditable="true"></td>');
            $row.append($td);
            var index = $td.index();

            $td.on('keyup', function() {
                $errors.css('background-color', '');
                $errors = $();

                var done = false;
                foreach_comb(row_i, num_msgs - 1, function(arr) {
                    if (done) {return;}
                    for (var j = 1; j < arr.length; j++) {
                        if (arr[j - 1] >= arr[j]) {return;}
                    }

                    var $cols = get_conflicts(arr.concat([row_i]), index);
                    if ($cols) {
                        $errors = $cols.css('background-color', '#FFAAAA');
                        done = true;
                    }
                });
            });
        });
        $t.append($row);
        i++;
    }

    var get_conflicts = function(arr, col_i) {
        for (var i = 0; i < num_cols; i++) {
            if (i === col_i) {continue;}

            var $cols = $();
            for (var j = 0; j < arr.length; j++) {
                var $tds = $rows.eq(arr[j]).children();
                var $c1 = $tds.eq(i);
                var $c2 = $tds.eq(col_i);
                if ($c1.text() !== '' && $c1.text() === $c2.text()) {
                    $cols = $cols.add($c1).add($c2);
                } else {
                    $cols = undefined;
                    break;
                }
            }

            if ($cols) {
                return $cols;
            }
        }
    };

    var $rows = $t.children();
    return $t;
};

var $table = make_table(4, 2, 6);
$('.demo').append($table);
