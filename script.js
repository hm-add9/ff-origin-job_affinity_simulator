
$(document).ready(function() {
    
    // テスト用
    $('body').on('click', 'button#test1', function(event) {
        console.log('test1');
        saveSetting();
    });
    $('body').on('click', 'button#test2', function(event) {
        console.log('test2');
        loadSetting();
    });

    // setting save
    $('div#save_setting_area').on('click', 'button#save', function(event) {
        var saveName = $('div#save_setting_area [name="save_key"]').val();
        saveSetting(saveName);
        createLoadButton();
    });
    // setting load
    $('div#save_setting_area #load_setting_area').on('click', '#load', function(event) {
        var target = $(event.target);
        loadSetting(target.attr('save_name'));
        summaryValue();
        displayOnAllJobByCheckbox();
        result();
    });
    // setting delete
    $('div#save_setting_area #load_setting_area').on('click', '#delete', function(event) {
        var target = $(event.target);
        deleteSetting(target.prev().attr('save_name'));
        createLoadButton();
    });

    // display all job -on
    $('div#job_display_switch_area').on('click', 'button#all_on', function(event) {
        $('#job_display_switch_area [id="disp_switch"]').prop('checked', true);
        $('table#value_input td[job]').show();
        $('table#result tr[job]').show();
    });
    // display all job -off
    $('div#job_display_switch_area').on('click', 'button#all_off', function(event) {
        $('#job_display_switch_area [id="disp_switch"]').prop('checked', false);
        $('table#value_input td[job]').hide();
        $('table#result tr[job]').hide();
    });
    // check display job
    $('#job_display_switch_area').on('change', '[id="disp_switch"]', function(event) {
        var target = $(event.target);
        var job = target.attr('job');
        controlDisplayJob(job, target.prop('checked'));
    });

    // clear all value
    $('div#value_input_area').on('click', 'button#clear', function(event) {
        $('table#value_input input').val('');
        $('table#value_input tr:nth-child(n+2) [id="set_num"]').html('0');
    });
    // summary
    $('table#value_input').on('blur', 'input', function(event) {
        summaryValue();
    });
    // set value to specify
    $('div#value_input_area').on('click', 'button#value_onoff', function(event) {
        var target = $(event.target);
        var inputElement = target.prev();
        if (inputElement.val()) {
            inputElement.val('');
        } else {
            inputElement.val('200');
        }
        summaryValue();
    });

    // toggle display job-affinitys of all or selected job only
    $('div#result_area').on('change', '[name="filter_job"]', function(event) {
        var target = $(this);
        filterDisplayResultJob(target.val());
    });
    // result
    $('div#result_area').on('click', '[id="result"]', function(event) {
        result();
    });
    // toggle affinity marking
    $('div#result_area').on('click', 'table#result tr:nth-child(n+2) td:nth-child(n+2)', function(event) {
        var target = $(this);
        if (target.attr('marking') == 'on') {
            target.attr('marking', 'off');
        } else {
            target.attr('marking', 'on');
        }
    });

    createLoadButton();
    summaryValue();
    displayOnAllJobByCheckbox();
    result();
});


function result() {
    $('table#value_input tr#summary input').each(function(index, element) {
        var target = $(this);
        var job = target.attr('job');
        var value = $('table#value_input tr#summary input[job="' + job + '"]').val();
        cahngeJobAvailable(job, value);
    });
}

function filterDisplayResultJob(selectValue) {
    if (selectValue == 'all') {
        $('table#result tr[job]').show();
    } else {
        $('div#job_display_switch_area input').each(function(index, element) {
            var target = $(this);
            var job = target.attr('job');
            if (!target.prop('checked')) {
                $('table#result [job="' + job + '"]').hide();
            }
        });
    }
}

function cahngeJobAvailable(job, value) {
    if (value && !value.match(/[^0-9]/)) {

        $('table#result [job="' + job + '"] td:nth-child(2)').attr('id', '');
        $('table#result [job="' + job + '"] td:nth-child(3)').attr('id', '');
        $('table#result [job="' + job + '"] td:nth-child(4)').attr('id', '');
        $('table#result [job="' + job + '"] td:nth-child(5)').attr('id', '');

        if (value >= 50) {
            $('table#result [job="' + job + '"] td:nth-child(2)').attr('id', 'job_available_on');
        }
        if (value >= 250) {
            $('table#result [job="' + job + '"] td:nth-child(3)').attr('id', 'job_available_on');
        }
        if (value >= 400) {
            $('table#result [job="' + job + '"] td:nth-child(4)').attr('id', 'job_available_on');
        }
        if (value >= 600) {
            $('table#result [job="' + job + '"] td:nth-child(5)').attr('id', 'job_available_on');
        }
    }
}

function displayOnAllJobByCheckbox() {

    $('div#job_display_switch_area input[job]').each(function(index, element) {
        var target = $(this);
        var job = target.attr('job');
        var displayOnFlg = target.prop('checked');
        controlDisplayJob(job, displayOnFlg);
    });
}


function controlDisplayJob(job, displayOnFlg) {
    if (displayOnFlg) {
        $('table#value_input [job="' + job + '"]').show();
        $('table#result [job="' + job + '"]').show();
    } else {
        $('table#value_input [job="' + job + '"]').hide();
        $('table#result [job="' + job + '"]').hide();
    }
}

function summaryValue() {

    $('table#value_input tr#header td').each(function(index, element) {
        var job = $(this).attr('job');
        var sum = 0;
        $('table#value_input tr#value input[job="' + job + '"]').each(function(index, element) {
            var value = $(this).val();
            if (value && !value.match(/[^0-9]/)) {
                sum += parseInt(value, 10);
            }
        });
        $('table#value_input tr#summary input[job="' + job + '"]').val(sum);
    });

    // 入力されている textbox にスタイルを適用
    $('table#value_input input[job]').each(function(index, element) {
        var target = $(this);
        if (target.val()) {
            target.attr('inputed', 'on');
        } else {
            target.attr('inputed', 'off');
        }
    });

    countSetNum();
}

function countSetNum() {
    
    $('table#value_input tr').each(function(index, element) {
        var target = $(this);
        if (target.attr('id') == 'value') {
            var setNum = 0;
            target.find('input[job]').each(function(index, element) {
                if ($(this).val()) {
                    setNum++;
                }
            });
            target.find('[id="set_num"]').html(setNum);
        }
    });
}



function saveSetting(saveName) {

    if (!saveName) {
        alert('input save name!!');
        return;
    }

    var displayJobs = {};
    $('div#job_display_switch_area input').each(function(index, element) {
        var target = $(this);
        var job = $(this).attr('job');
        var onoff = target.prop("checked");

        displayJobs[job] = onoff;
    });

    var jobValues = {};
    $('table#value_input tr').each(function(index, element) {
        var target = $(this);
        var parts = target.attr('parts');
        if (parts) {
            target.find('td input').each(function(index, element) {
                var input = $(this);
                var job = input.attr('job');
                var value = input.val();
                
                if (!jobValues[job]) {
                    jobValues[job]= {};
                } 
                jobValues[job][parts] = value;
            });
        }
    });

    var affinityMarkings = [];
    $('table#result td[marking="on"]').each(function(index, element) {  // loop tr
        $(this).each(function(index, element) { // loop td
            var target = $(this);
            if (target.attr('marking') == 'on') {
                affinityMarkings.push({
                    // trPos: trPos,
                    // tdPos: tdPos,
                    name: target.children('#affinity_name').text()
                });
            }
        });
    });

    var settingJson = localStorage.getItem('setting');
    var setting = {};
    if (settingJson) {
        setting = JSON.parse(settingJson).setting;  // storageキー名'setting'にくるまれて、返ってくるので注意
    }

    if (setting[saveName]) {
        if (!window.confirm('overwrite?')) {
            return;
        }
    }
    
    setting[saveName] = {
        displayJobs: displayJobs,
        jobValues: jobValues,
        affinityMarkings: affinityMarkings
    };

    localStorage.setItem('setting', JSON.stringify({
        setting
    }));
}

function loadSetting(saveName) {
    var settingAll = getStorageSetting();
    if (!settingAll) {
        return;
    }

    var setting = settingAll[saveName];

    if (!setting) {
        alert('not exit setting!!')
        return;
    }

    if(setting.displayJobs) {
        for (job in setting.displayJobs) {
            $('div#job_display_switch_area input[job="' + job + '"]').prop('checked', setting.displayJobs[job]);
        }
    }

    if(setting.jobValues) {
        for (job in setting.jobValues) {
            for (parts in setting.jobValues[job]) {
                $('table#value_input tr[parts="' + parts + '"] input[job="' + job + '"]').val(setting.jobValues[job][parts]);
            }
        }
    }

    if(setting.affinityMarkings) {
        $('[marking="on"]').attr('marking', 'off');
        for (job in setting.affinityMarkings) {
            var affinityName = setting.affinityMarkings[job].name;
            $(':contains("' + affinityName + '")').parents('td').attr('marking', 'on');
        }
    }

    $('#save_setting_area [name="save_key"]').val(saveName);

}

function deleteSetting(saveName) {

    var setting = getStorageSetting();
    if (!setting) {
        return;
    }

    delete setting[saveName];

    localStorage.setItem('setting', JSON.stringify({
        setting
    }));
}

function createLoadButton() {
    var setting = getStorageSetting();
    if (!setting) {
        return;
    }

    $('div#save_setting_area #load_setting_area').empty();
    for (saveName in setting) {
        $('div#save_setting_area #load_setting_area')
            .append($(
                '<div id="load_setting">' +
                    '<div id="load" save_name = "' + saveName + '">' + saveName + '</div>' +
                    '<div id="delete">X</div>'+
                '</div>'
            ))
    }
}


function getStorageSetting() {
    var settingJson = localStorage.getItem('setting');
    if (!settingJson) {
        return null;
    }
    return JSON.parse(settingJson).setting;
}