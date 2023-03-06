
$(document).ready(function() {
    
    $('body').on('click', 'button#test1', function(event) {
        console.log('test1');
        saveSetting();
    });
    $('body').on('click', 'button#test2', function(event) {
        console.log('test2');
        loadSetting();
    });
    
    $('div#job_display_switch_area').on('click', 'button#all_on', function(event) {
        $('#job_display_switch_area [id="disp_switch"]').prop('checked', true);
        $('table#value_input td[job]').show();
        $('table#result tr[job]').show();
    });
    $('div#job_display_switch_area').on('click', 'button#all_off', function(event) {
        $('#job_display_switch_area [id="disp_switch"]').prop('checked', false);
        $('table#value_input td[job]').hide();
        $('table#result tr[job]').hide();
    });

    $('div#value_input_area').on('click', 'button#save', function(event) {
        var saveName = $('div#value_input_area [name="save_key"]').val();
        saveSetting(saveName);
    });

    $('div#value_input_area').on('click', '#load_setting', function(event) {
        var target = $(event.target);
        loadSetting(target.attr('save_name'));
        summaryValue();
        displayOnAllJobByCheckbox();
        result();
    });
   

    $('div#value_input_area').on('click', 'button#clear', function(event) {
        $('table#value_input input').val('');
        $('table#value_input tr:nth-child(n+2) [id="set_num"]').html('0');
    });

    $('#job_display_switch_area').on('change', '[id="disp_switch"]', function(event) {
        var target = $(event.target);
        var job = target.attr('job');
        controlDisplayJob(job, target.prop('checked'));
    });

    $('table#value_input').on('blur', 'input', function(event) {
        summaryValue();
    });

    $('div#result_area').on('change', '[name="filter_job"]', function(event) {
        var target = $(this);
        filterDisplayResultJob(target.val());
    });

    $('div#result_area').on('click', '[id="result"]', function(event) {
        result();
    });

    createLoadButton();
    summaryValue();
    displayOnAllJobByCheckbox();
    result();
});

function result() {
    $('table#value_input tr#summary input').each(function(val, index, ar) {
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
        $('div#job_display_switch_area input').each(function(val, index, ar) {
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

    $('div#job_display_switch_area input[job]').each(function(val, index, ar) {
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

    $('table#value_input tr#header td').each(function(val, index, ar) {
        var job = $(this).attr('job');
        var sum = 0;
        $('table#value_input tr#value input[job="' + job + '"]').each(function(val, index, ar) {
            var value = $(this).val();
            if (value && !value.match(/[^0-9]/)) {
                sum += parseInt(value, 10);
            }
        });
        $('table#value_input tr#summary input[job="' + job + '"]').val(sum);
    });
    // var target = $('table#value_input tr#value input[job="' job ' "]');

    countSetNum();
}

function countSetNum() {
    
    $('table#value_input tr').each(function(val, index, ar) {
        var target = $(this);
        if (target.attr('id') == 'value') {
            var setNum = 0;
            target.find('input[job]').each(function(val, index, ar) {
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
    $('div#job_display_switch_area input').each(function(val, index, ar) {
        var target = $(this);
        var job = $(this).attr('job');
        var onoff = target.prop("checked");

        displayJobs[job] = onoff;
    });

    var jobValues = {};
    $('table#value_input tr').each(function(val, index, ar) {
        var target = $(this);
        var parts = target.attr('parts');
        if (parts) {
            target.find('td input').each(function(val, index, ar) {
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
        jobValues: jobValues
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

}

function createLoadButton() {
    var setting = getStorageSetting();;
    if (!setting) {
        return;
    }

    for (saveName in setting) {
        $('div#value_input_area #load_setting_area').append(
            $('<button id="load_setting" save_name = "' + saveName + '">' + saveName + '</button>')
        );
    }
}


function getStorageSetting() {
    var settingJson = localStorage.getItem('setting');
    if (!settingJson) {
        return null;
    }
    return JSON.parse(settingJson).setting;
}