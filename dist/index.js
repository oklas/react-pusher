'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPusherClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pusher = function (_Component) {
  _inherits(Pusher, _Component);

  function Pusher(props) {
    _classCallCheck(this, Pusher);

    if (!Pusher.pusherClient) {
      throw new Error('you must set a pusherClient by calling setPusherClient');
    }

    var _this = _possibleConstructorReturn(this, (Pusher.__proto__ || Object.getPrototypeOf(Pusher)).call(this, props));

    _this._channel = null;

    _this.bindPusherEvent(props.channel, props.event);
    return _this;
  }

  _createClass(Pusher, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var newChannel = _ref.channel,
          newEvent = _ref.event;
      var _props = this.props,
          channel = _props.channel,
          event = _props.event;

      console.log('UPDATE');
      console.log(newChannel);
      console.log(channel);
      if (channel === newChannel && event === newEvent) {
        return;
      }

      this.unbindPusherEvent(channel, event);
      this.bindPusherEvent(newChannel, newEvent);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindPusherEvent(this.props.channel, this.props.event);
    }
  }, {
    key: 'unbindPusherEvent',
    value: function unbindPusherEvent(channel, event) {
      this._channel.unbind(event, this.props.onUpdate);
      Pusher.channels[channel]--;

      if (Pusher.channels[channel] <= 0) {
        delete Pusher.channels[channel];
        Pusher.pusherClient.unsubscribe(channel);
      }
    }
  }, {
    key: 'bindPusherEvent',
    value: function bindPusherEvent(channel, event) {
      this._channel = Pusher.pusherClient.channels.find(channel) || Pusher.pusherClient.subscribe(channel);
      this._channel.bind(event, this.props.onUpdate);

      if (Pusher.channels[channel] === undefined) Pusher.channels[channel] = 0;
      Pusher.channels[channel]++;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('noscript', null);
    }
  }]);

  return Pusher;
}(_react.Component);

Pusher.propTypes = {
  channel: _react.PropTypes.string.isRequired,
  onUpdate: _react.PropTypes.func.isRequired,
  event: _react.PropTypes.string.isRequired
};
Pusher.pusherClient = null;
Pusher.channels = {};
exports.default = Pusher;
var setPusherClient = exports.setPusherClient = function setPusherClient(pusherClient) {
  Pusher.pusherClient = pusherClient;
};
