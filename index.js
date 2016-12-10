exports.handler = (event, context, callback) => {

    var say = "";
    var quantity;
    var fromConvert;
    var toConvert;
    var shouldEndSession = false;

    var fromArray =  [
        {"Name": "kilometers", "Id": asciiNameDouble("kilometers")},
        {"Name": "fahrenheit", "Id": asciiNameDouble("fahrenheit")},
        {"Name": "tablespoons", "Id": asciiNameDouble("tablespoons")}
    ];

    var toArray = [
        {"Name": "meters", "Id": asciiName("meters")},
        {"Name": "celsius", "Id": asciiName("celsius")},
        {"Name": "fluid ounces", "Id": asciiName("fluid ounces")}
    ];

    var conversionArray = [
        {"Name": "km to m", "Id": 2830, "Function": kilometersToMeters},
        {"Name": "f to c" ,"Id": 2868, "Function": fahrenheitToCelsius},
        {"Name": "tbsp to floz", "Id": 3605, "Function": tablespoonToFluidounces}
    ];

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }

    if (event.request.type === "LaunchRequest") {
        say = "Hey there, launching now";

    } else {
        var IntentName = event.request.intent.name;

        if (IntentName === "ConversionIntent") {

            if (event.request.intent.slots.quantity.value && event.request.intent.slots.from.value &&
                event.request.intent.slots.quantity.value) {

                quantity = event.request.intent.slots.quantity.value;

                fromConvert = event.request.intent.slots.from.value;

                toConvert = event.request.intent.slots.to.value;
                // loop through dataset and find array value that matches the state the requested

                for (i = 0; i < fromArray.length; i++) {
                    if (fromArray[i].Name === fromConvert) {
                        fromId = fromArray[i].Id;
                        fromName = fromArray[i].Name;
                    }
                }

                for (i = 0; i < toArray.length; i++) {
                    if (toArray[i].Name === toConvert) {
                        toId = toArray[i].Id;
                        toName = toArray[i].Name;
                    }
                }

                for (i = 0; i < conversionArray.length; i++) {
                    if (fromArray[i].Id === fromId + toId) {
                        var result = conversionArray[i].function(quantity);
                    }
                }

                say = "There are " + result + " " +  toName +  " in " + quantity + " " + fromName;

                // add the state to a session.attributes array
                if (!sessionAttributes.requestList) {
                    sessionAttributes.requestList = [];
                }
                sessionAttributes.requestList.push(myState);

            }

        } else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            say = "You asked for " + sessionAttributes.requestList.toString() + ". Thanks for playing!";
            shouldEndSession = true;

        } else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "Tell me the amount that you want to convert, the unit to convert from, and the unit to convert to. "
                + "for example, convert three kilometers to meters."
        }
        // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
    }
    function buildSpeechletResponse(say, shouldEndSession) {
        return {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>" + say + "</speak>"
            },
            reprompt: {
                outputSpeech: {
                    type: "SSML",
                    ssml: "<speak>Please try again. " + say + "</speak>"
                }
            },
            card: {
                type: "Simple",
                title: "My Card Title",
                content: "My Card Content, displayed on the Alexa App or alexa.amazon.com"
            },

            shouldEndSession: shouldEndSession
        };
    }

    function asciiNameDouble(name) {
        var sum = 0;

        for(var i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
        }
        return (2*sum);
    }

    function asciiName(name) {
        sum = 0;

        for(var i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i);
        }
        return sum;
    }

    function kilometersToMeters(quantity) {
        return (quantity * 1000);
    }

    function fahrenheitToCelsius(quantity) {
        quantity = quantity - 32;
        return (quantity/1.8);
    }

    function tablespoonToFluidounces(quantity) {
        return (quantity/2);
    }
};


