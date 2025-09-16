Our API methods are divided into methods for searching for offers (REST Search API) and methods for directly booking/managing already created offers (SOAP Booking API).
Below is a flow of methods which is usually used when working with ‘Search API’:

First you need to get the list of departure cities (SearchTour_TOWNFROMS)
Then you can get the list of available countries for a particular departure city (SearchTour_STATES).
After that you can get a list of tours by destination (SearchTour_TOURS).
Now you can get possible tour start dates (SearchTour_CHECKIN), number of nights (SearchTour_NIGHTS) and currencies (SearchTour_CURRENCIES).

This is the basic set of data that is needed to retrieve prices for our products (SearchTour_PRICES). To retrieve these and other data, you can read the methods described in this documentation on the following pages.

To get data from API you need to have a login to online booking system and access token, which
is linked with your login. To get login or token, you need to contact with your personal manager
at Join UP!

Note, that access token is also linked with IP-addresses, you will make your requests from. To
change or add some IPs please contact with your manager. The current API version can link access
token only to IP-address of IPv4 version of Internet Protocol.

The general request for API is GET-request to the endpoint URL
https://online.joinupbaltic.eu/export/default.php with some mandatory parameters:
{oauth_token} - access token
{type} - desirable data format (xml or json)
{action} - method
{version} – current API version, 1.0. Version 2.0 is under development now and will be
described in the next specification release.

An example of request you can see below.
https://online.joinupbaltic.eu/export/default.php?samo_action=api&version=1.0&oauth_token=704f7431e2cb481303ced10e76987f31&type=xml&action=SearchTour_TOWNFROMS
Note, that all GET-parameters are case sensitive, so, for example, for
action=SearchTour_Townfroms you will get an error of unavailable action.
Mandatory parameters are bolded or described in brackets


Typical errors:
Usually responses with errors have only Error field.
apiKey provided, but invalid - means you use wrong access token
apiKey blacklisted - means you did request from source IP-address that is not linked with your access token.
Another kind of error description is message field. For example if you see “Method does not exists: …” it means wrong action parameter value.