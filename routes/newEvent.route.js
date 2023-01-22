const newEvent = require('express').Router()
const { EventModel, timeSchema } = require('../Models/Event.Model')


const middleware = (req, res, next) => {
    const { name, location, Description, eventLink, eventColor, eventDateRange, eventDuration, timing } = req.body
    if (!name || !location || !Description || !eventLink || !eventColor || !eventDateRange || !eventDuration || !timing) {
        return res.status(402).json({ err: 'all field should mandatory' })
    }

    if (typeof (name) != 'string' || typeof (location) != 'string' || typeof (Description) != 'string' || typeof (eventLink) != 'string' || typeof (eventColor) != 'string' || typeof (eventDateRange) != 'string' || typeof (eventDuration) != 'string' || typeof (timing) != 'array') {
        return res.status(402).json({ err: 'all field should mandatory' })
    }
    next()
}



newEvent.post('/', middleware, (req, res) => {
    const { name, location, Description, eventLink, eventColor, eventDateRange, eventDuration, timeObj } = req.body


    const week = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    };
    // const timeeObj = {
    //     monday: [{start:'4pm',end:'5pm',count:3},{start:'6pm',end:'7pm',count:6}],
    //     tuesday: [],
    //     wednesday: [],
    //     thursday: [],
    //     friday: [],
    //     saturday: [],
    //     sunday: []
    // };

    for (let days in timeObj) {
        let oneDay = timeObj[days]
        oneDay.forEach((slot) => {
            try {
                const newSlot = new timeSchema(slot);
                week[days].push(newSlot)
            } catch (err) {
                return res.status(402).json({ err: "bad request" })
            }

        })

    }
    let newEvent = new EventModel({ name, location, Description, eventLink, eventColor, eventDateRange, eventDuration, week })

    newEvent.save((err, data) => {
        if (err) {
            return res.status(500).json({ err: 'server problem' })
        } else {
            console.log(data);
        }
    })
    // timeArray.forEach(time => {
    //     days.time
    // });


})
