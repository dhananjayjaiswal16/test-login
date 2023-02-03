import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import { useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { jsx } from 'react/jsx-runtime';

var LoginWithGoogle = function LoginWithGoogle(_ref) {
  var clientId = _ref.clientId,
    isSignedIn = _ref.isSignedIn,
    getSignedStatus = _ref.getSignedStatus,
    getSignedInUserEmailId = _ref.getSignedInUserEmailId,
    getSignedInUserTokenId = _ref.getSignedInUserTokenId,
    apiRoot = _ref.apiRoot;
  useEffect(function () {
    /*global google*/
    window.onload = function () {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: onSuccess
      });
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: 'outline',
        size: 'large'
      });
    };
  }, []);
  var onSuccess = function onSuccess(response) {
    var token = response.credential;
    var googleUser = jwt_decode(response.credential);
    if (googleUser.hd !== "werize.com") {
      alert("Try werize mail id");
      return;
    }
    verifyAndPersist(googleUser, token);
  };
  var verifyAndPersist = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(googleUser, token) {
      var payload, tokenId, emailId, headers, res;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            payload = {};
            tokenId = token;
            emailId = googleUser.email;
            headers = {
              'Content-Type': 'application/json',
              'google_id_token': tokenId,
              'logged_in_user_email_id': emailId
            };
            _context.prev = 4;
            _context.next = 7;
            return axios.post("".concat(apiRoot, "/api/googleOAuth/token/verify"), payload, {
              headers: headers
            });
          case 7:
            res = _context.sent;
            getSignedStatus(res.data.entity);
            if (res.data.entity === false) {
              localStorage.removeItem("token");
              getSignedStatus(false);
            } else {
              localStorage.setItem("token", token);
              getSignedInUserEmailId(emailId);
              getSignedInUserTokenId(tokenId);
            }
            _context.next = 15;
            break;
          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](4);
            if (_context.t0.response) {
              console.log("error in req 1", _context.t0.response);
              getSignedStatus(false);
            }
          case 15:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 12]]);
    }));
    return function verifyAndPersist(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  var getContent = function getContent() {
    return !isSignedIn && /*#__PURE__*/jsx("div", {
      className: "App",
      children: /*#__PURE__*/jsx("center", {
        id: "signInDiv"
      })
    });
  };
  return /*#__PURE__*/jsx("div", {
    style: {
      marginTop: "200px"
    },
    children: getContent()
  });
};

export { LoginWithGoogle as default };
