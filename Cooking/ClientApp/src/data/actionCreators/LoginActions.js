import api from "../../api/api";
import setAuthorizationToken from './../../utils/SetAuthorizationToken';
import { SET_CURRENT_USER } from './Types';

export function setCurrentUser(isAuthorized, isModerator) {
    return {
        type: SET_CURRENT_USER,
        user : {
            isAuthorized : isAuthorized,
            isModerator : isModerator
        }
    };
}
export function logout(data) {
    return (dispatch) => {
        console.log("inner")
        setAuthorizationToken(false);
        localStorage.removeItem('jwtToken');
        dispatch(setCurrentUser(false, false));
    };;
}

export function login(data) {
    return (dispatch) => {
        return api.post("/account/token", data, {withCredentials: false}).then(res => {
            
            const token = res.data.token;

            localStorage.setItem('jwtToken', token);

            setAuthorizationToken(token);

            dispatch(setCurrentUser(true, res.data.isModerator));
        });
    };;
}


export function jwtDecode(token, options) {
    if (typeof token !== "string") {
        throw new Error("Invalid token specified: must be a string");
    }
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") {
        throw new Error(`Invalid token specified: missing part #${pos + 1}`);
    }
    let decoded;
    try {
        decoded = base64UrlDecode(part);
    }
    catch (e) {
        throw new Error(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
        return JSON.parse(decoded);
    }
    catch (e) {
        throw new Error(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
}

function base64UrlDecode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw new Error("base64 string is not of the correct length");
    }
    try {
        return b64DecodeUnicode(output);
    }
    catch (err) {
        return atob(output);
    }
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = "0" + code;
        }
        return "%" + code;
    }));
}