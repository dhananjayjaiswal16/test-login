import { useEffect } from "react"
import axios from "axios";
import jwt_decode from 'jwt-decode'
const LoginWithGoogle = ({ clientId, isSignedIn, getSignedStatus, getSignedInUserEmailId, getSignedInUserTokenId, apiRoot }) => {

  useEffect(() => {
    /*global google*/
    window.onload = function () {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: onSuccess
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: 'outline',
        size: 'large'
      })
    }
  }, [])


  const onSuccess = (response) => {
    const token = response.credential;
    const googleUser = jwt_decode(response.credential);
    if (googleUser.hd !== "werize.com") {
      alert("Try werize mail id");
      return;
    }
    verifyAndPersist(googleUser, token);
  }



  const verifyAndPersist = async (googleUser, token) => {
    const payload = {}
    const tokenId = token;
    const emailId = googleUser.email;
    const headers = {
      'Content-Type': 'application/json',
      'google_id_token': tokenId,
      'logged_in_user_email_id': emailId
    }
    try {
      const res = await axios.post(`${apiRoot}/api/googleOAuth/token/verify`, payload, { headers: headers })
      getSignedStatus(res.data.entity);
      if (res.data.entity === false) {
        localStorage.removeItem("token");
        getSignedStatus(false);
      } else {
        localStorage.setItem("token", token)
        getSignedInUserEmailId(emailId);
        getSignedInUserTokenId(tokenId);
      }
    } catch (error) {
      if (error.response) {
        console.log("error in req 1", error.response);
        getSignedStatus(false);
      }
    }
  }

  const getContent = () => {
    return (
      !isSignedIn && (
        <div className="App">
          <center id="signInDiv"></center>
        </div>
      )
    );
  }

  return <div style={{ marginTop: "200px" }}>{getContent()}</div>;
}

export default LoginWithGoogle;