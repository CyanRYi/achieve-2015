class CommonAjaxHandler {
	call(url, method, success, error, param) {

		// csrf Token Setter
		var metaTags = document.getElementsByTagName("meta");

		var csrfToken;
		var csrfHeader;

		for (var counter = 0; counter < metaTags.length; counter++) {
	        if (metaTags[counter].getAttribute('name') == '_csrf') {
	        	csrfToken = metaTags[counter].content;
	        }

	        if (metaTags[counter].getAttribute('name') == '_csrf_header') {
	        	csrfHeader = metaTags[counter].content;
	        }
	    }

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
                error(xhr);
            }
        }
    };
    if (method === 'GET' || method === 'get') {
    	xhr.send();
    }
    else {
    	xhr.send(JSON.stringify(params));
    }
	}
};

export default CommonAjaxHandler;
