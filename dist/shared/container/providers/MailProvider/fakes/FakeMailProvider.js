"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeMailProvider {
  constructor() {
    this.messages = [];
  }

  async sendMail(data) {
    if (data.from) throw new Error();
    this.messages.push({
      to: data.to.email,
      body: 'fake-message'
    });
  }

}

exports.default = FakeMailProvider;