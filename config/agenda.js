const Agenda = require("agenda");

//TODO configure according to env - dev or prod!
var agenda = new Agenda(
    {
        db:
            {
                address: 'localhost:27017/agenda',
                collection: 'agendaJobs'
            }
    }
);
agenda.start();

module.exports = agenda;