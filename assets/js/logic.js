var config = {
    apiKey: "AIzaSyCEuuLh-5Qe4ac2e0DXwRmqIM1iwaM3Mxc",
    authDomain: "train-schedule-3efb2.firebaseapp.com",
    databaseURL: "https://train-schedule-3efb2.firebaseio.com",
    projectId: "train-schedule-3efb2",
    storageBucket: "train-schedule-3efb2.appspot.com",
    messagingSenderId: "1045508050313"
};
firebase.initializeApp(config);

var database = firebase.database();

var addTrain = function(name, dest, startTime, freq) {

    if (isNaN(freq)) {
        alert("Invalid value for \"Frequency\"");
    }
    else {
        database.ref().push({
            name: name,
            destination: dest,
            firstTrainTime: startTime,
            frequency: freq,
        });    
    }
};

database.ref().on("child_added", function(childSnapshot) {
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().destination;
    var freq = childSnapshot.val().frequency;
    var startTime = childSnapshot.val().firstTrainTime;
    var convertedTime = moment(startTime, "HH:mm");
    var difference = moment(convertedTime).diff(moment(), "minutes");
    var nextArrival;
    if (difference >= 0) {
        nextArrival = moment(convertedTime).format("hh:mm A");;
    }
    else if(difference < 0) {
        var cycles = Math.ceil(Math.abs(difference / freq));
        var minutes = cycles * freq;
        convertedTime = moment(convertedTime).add(minutes, "minutes");
        nextArrival = moment(convertedTime).format("hh:mm A");
    };
    var minAway = convertedTime.diff(moment(), "minutes")

    var tr = $("<tr>");
    var tdName = $("<td>").text(name);
    var tdDest = $("<td>").text(dest);
    var tdFreq = $("<td>").text(freq);
    var tdNextArrival = $("<td>").text(nextArrival);
    var tdMinAway = $("<td>").text(minAway);

    tr.append(tdName);
    tr.append(tdDest);
    tr.append(tdFreq);
    tr.append(tdNextArrival);
    tr.append(tdMinAway);

    $("#tbody").append(tr);
});