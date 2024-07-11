"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handler_1 = require("src/services/monitor/handler");
var snsEvent = {
    Records: [
        {
            Sns: {
                Message: 'This is a test',
            }
        }
    ]
};
(0, handler_1.handler)(snsEvent, {});
