class CommonAjaxHandler {
	call(url, method, success, error, param) {

		// csrf Token Setter
		var metaTags = document.getElementsByTagName("meta");

		var csrfToken = metaTags._csrf.content;
		var csrfHeader = metaTags._csrf_header.content;

		var xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader(csrfHeader, csrfToken);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
            	if (success) {
            		success(xhr.responseText);
            	}
							else return true;
            } else {
							if (error) {
								error(xhr.responseText);
							}
            }
        }
    };
    if (method === 'GET' || method === 'get') {
    	xhr.send();
    }
    else {
    	xhr.send(JSON.stringify(param));
    }
	}
};

export default CommonAjaxHandler;
