(function (window) {
    //just a variable/object
    let $M = {};
    //list that holds routing details i.e., route url and function to execute
    $M.RoutingList = [];
    //to check status of pages
    $M.currentPage = "";

    //Routing class which has multiple properties i.e., url,function to execute when
    const RoutingClass = function (u, f, t) {
        this.Params = u.split("/").filter((h) => { return h.length > 0; });
        this.Url = u;
        this.Fn = f;

        this.Title = t;
    };

    //simple utility function that return 'false' or url params 
    //will parse url and fetches param values from 'location.href'
    const checkParams = (urlParams, routeParams) => {
        let paramMatchCount = 0, paramObject = {};

        for (let i = 0; i < urlParams.length; i++) {
            const rtParam = routeParams[i];
            if (rtParam.indexOf(":") >= 0) {
                paramObject[rtParam.split(":")[1]] = urlParams[i];
                paramMatchCount += 1;
            }
        }

        if (paramMatchCount === urlParams.length) {
            return paramObject;
        }

        return false;
    };

    //will executes 'function(s)' which are binded to respective 'url'
    //along with values of url params for e.g.,
    //:     /:page/:pageid 
    //:     /home/3434434
    //values will be page=>home and pageid=>3434434
    $M.loadController = (urlToParse) => {
        if ($M.currentPage !== urlToParse) {
            $M.previousPage = $M.currentPage;
            $M.currentPage = urlToParse;
            const uParams = urlToParse.split("/").filter((h) => {
                return h.length > 0;
            });
            let isRouteFound = 0;
            for (let i = 0; i < $M.RoutingList.length; i++) {
                const routeItem = $M.RoutingList[i];
                if (routeItem.Params.length === uParams.length) {
                    const _params = checkParams(uParams, routeItem.Params);
                    if (_params) {
                        _params.Title = routeItem.Title;
                        isRouteFound += 1;
                        routeItem.Fn.call(null, _params);
                    }
                }
            }
        }
        else
        {
            console.log("You are on the same page!");
        }
    };

    //uses browsers pushSate functionality to navigate from one page to another
    //and loads respective controller to execute
    $M.navigateTo = (navigateTo) => {
        window.history.pushState(null, null, navigateTo);
        $M.loadController(navigateTo);
    };

    //will add 'url' and 'function' to routing list
    $M.addRoute = (urlToMatch, fnToExecute, t) => {
        if (typeof urlToMatch === "string") {
            $M.RoutingList.push(new RoutingClass(urlToMatch, fnToExecute, t));
        }
        else if (typeof urlToMatch && urlToMatch instanceof Array) {
            urlToMatch.forEach(item => {
                $M.RoutingList.push(new RoutingClass(item, fnToExecute, t));
            });
        }
    };

    //binding routing object to window as '$NB'
    window.$NB = $M;
})(window);