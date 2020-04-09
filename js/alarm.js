
var date = moment().local();
const alarmSound = new Audio("alarm_sound.mp3");

function loadAlarmConfig() {

    return  {
        time: {
            "day":   moment().local().format("DD"),
            "month":  moment().local().format("MM"),
            "hour": moment().local().format("h"),
            "minute": moment().local().format("m"),
            "second": moment().local().format("s"),
            a: moment().local().format("A"),
            year:  moment().local().format("YYYY")
        },
        alarms: [],
        create_alarm: false,
        alarm_error: '',
        is_alarm_error: false,
        alarm: {
            "hour": 0,
            "minute": 00,
            "second": 00,
            "title": ""
        },
        statTimer: function() {

            const self = this;
            this.create_alarm_button = true;

            function updateValue() {
                self.time.day = moment().local().format("D");
                self.time.month = moment().local().format("M");
                self.time.hour = moment().local().format("h");
                self.time.minute = moment().local().format("m");
                self.time.second = moment().local().format("s"); 
                self.time.a = moment().local().format("A");               
            }

            setInterval(() => {
                // console.log("Updating things");
                updateValue();
            }, 1000);

            function runAlarms() {

                self.alarms = self.alarms.map((alarm) => {
                    if(alarm.active === true) {
                        const current_date = new moment().local()
                        const diff = diffYMDHMS(alarm.start_time, current_date);
            
                        let label = getAlarmLabel(diff);
                        let completed = isAlarmCompleted(diff);
                        if (completed == true) {
                            console.log("BEEP BEEP")
                            alarmSound.play();
                        } else {
                            alarm.time_left = label;
                        }
                        alarm.completed = completed;
                       
                    }
                    return alarm;
                })
            }

            setInterval(() => {
                runAlarms();
            }, 2000);


        },
        createAlarm: function() {

            this.create_alarm = true;

            this.alarm = {
                "hour": this.time.hour,
                "minute": this.time.minute,
                "second": this.time.second,
                "title": "",
                "a": this.time.a
            };
        },
        saveAlarm: function() {

            if(this.alarm.title == '') {
                this.alarm_error = "Please enter why you setting this alarm";
                this.is_alarm_error = true;
                return;
            }

            const alarm_date = moment(`${this.alarm.hour}:${this.alarm.minute} ${this.alarm.a}`, 'hh:mm A')
            
            const current_date = new moment().local()
            const diff = diffYMDHMS(alarm_date, current_date);

            if (isAlarmCompleted(diff)) {
                this.alarm_error = "This alarm is not valid. Choose proper time";
                this.is_alarm_error = true;
                return ;
            }

            let label = getAlarmLabel(diff);

            this.alarm.time = diff;
            this.alarm.start_time = alarm_date;
            this.alarm.label = label;
            this.alarm.time_left = label;
            this.alarm.active = true;
            this.alarm.completed = false;
            this.alarm.index = this.alarms.length;
            this.alarm_error = "";
            this.is_alarm_error = false;

            this.alarms.push(copyObject(this.alarm));
        },
        deactivateAlarm: function(item) {
            console.log("Alarm deactivated : ", item);
            this.alarms = this.alarms.map((alarm) => {
                if(alarm.index === item) {
                    
                    alarm.completed = true;
                    alarm.active = false;
                    alarmSound.pause();
                }
                return alarm;
            })
        }
    }
}

function copyObject(alarm) {
    return  Object.assign({}, alarm);
}

function isAlarmCompleted(diff) {

    return ["hours", "minutes", "seconds"].map((key) =>  {
        
        return diff[key] <= 0;
    }).filter((key) => key === false).length === 0;
}

function getAlarmLabel(diff) {
    let label = '';

    ["hours", "minutes", "seconds"].map((key) =>  {
        if(diff[key] !== 0) {
            label = label + `${diff[key]} ${key} `;
        }
    })

    return label;
}


function diffYMDHMS(date1, date2) {

    let hours = date1.diff(date2, 'hours');
    date2.add(hours, 'hours');

    let minutes = date1.diff(date2, 'minutes');
    date2.add(minutes, 'minutes');

    let seconds = date1.diff(date2, 'seconds');

    console.log( hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'); 

    return { hours, minutes, seconds};
}
