// notes

var maputil = require('./maputil.js');

var map = function (v2JSON) {
    var statusListStatus;
    var statusComplete = false;

    if (v2JSON.queryComplete === "true") {
        for (var i = 0; i < v2JSON.statusList.length; i++) {
            if (v2JSON.statusList[i].SiteStatus === "COMPLETE");
            statusListStatus = v2JSON.statusList[i];
            statusComplete = true;
        }
    }
    if (!statusComplete) {
        return {
            "dataList": [

            ]
        }
    }

    var v3JSON = {
        "queryComplete": "true",
        "statusList": [
            statusListStatus
        ]
    }

    var v3DataList = [];

    for (var i = 0; i < v2JSON.dataList.length; i++) {
        var v2DataRecord = v2JSON.dataList[i].dataRecord;

        var v3DataRecord = maputil.baseTransform(v2DataRecord);

        //v3DataRecord.comments = maputil.nullInsteadOfEmptyString(v2DataRecord.Comments);
        v3DataRecord.responseDate = maputil.nullInsteadOfEmptyString(v2DataRecord.DateFilledOut);

        if (v2DataRecord.Details instanceof Array) {
            v3DataRecord.responses = v2DataRecord.Details.map(function (v2Detail) {
                var response = {};

                if (v2Detail.Answers instanceof Array) {
                    response.answers = v2Detail.Answers.map(function (v2Answer) {
                        var v3Answer = {};

                        v3Answer.answer = maputil.nullInsteadOfEmptyString(v2Answer.Answer);
                        v3Answer.answerType = maputil.nullInsteadOfEmptyString(v2Answer.AnswerType);
                        v3Answer.choice = Number(v2Answer.Choice);
                        v3Answer.correctAnswer = maputil.nullInsteadOfEmptyString(v2Answer.CorrectAnswer);

                        return v3Answer;
                    });
                }
                if (v2Detail.Choices instanceof Array) {
                    response.choices = v2Detail.Choices.map(function (v2Choice) {
                        var v3Choice = {};

                        v3Choice.choice = Number(v2Choice.Choice);
                        v3Choice.answerType = maputil.nullInsteadOfEmptyString(v2Choice.AnswerType);
                        v3Choice.text = maputil.nullInsteadOfEmptyString(v2Choice.ChoiceText);
                        v3Choice.correctAnswer = maputil.nullInsteadOfEmptyString(v2Choice.CorrectAnswer);
                        v3Choice.selected = v2Choice.IsSelected === "true";

                        return v3Choice;
                    });
                }
                if (v2Detail.Comments instanceof Array) {
                    response.comments = v2Detail.Comments.map(function (v2DetailComment) {
                        var v3DetailComment = {};

                        v3DetailComment.enteredDate = maputil.nullInsteadOfEmptyString(v2DetailComment.DateEntered);
                        v3DetailComment.commentNumber = Number(v2DetailComment.NoteNumber);
                        v3DetailComment.comment = maputil.nullInsteadOfEmptyString(v2DetailComment.NoteText);
                        v3DetailComment.sequenceNumber = Number(v2DetailComment.SeqNumber);
                        v3DetailComment.enteredBy = maputil.nullInsteadOfEmptyOneElementObject(v2DetailComment.CommentBy, "name");

                        return v3DetailComment;
                    });
                }

                response.question = maputil.nullInsteadOfEmptyString(v2Detail.QuestionText);
                response.sequenceNumber =  Number(v2Detail.SequenceNum);

                return response;

            });
        }



        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 15
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;