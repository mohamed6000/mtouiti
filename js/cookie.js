// cookies: w3school
document.addEventListener("DOMContentLoaded", function()
{
    let acc = GetCookie("acc");
    if (acc == "true")
    {
        let cookieNotif = document.getElementsByClassName("cookieNotif")[0];
        cookieNotif.hidden = true;
    }
});

function SetCookie(name, val, nDays)
{
    const d = new Date();
    d.setTime(d.getTime() + (nDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + val + ";" + expires + "path=/";
}

function GetCookie(name)
{
    let cookieName = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArr = decodedCookie.split(";");

    for (let i = 0; i < cookieArr.length; i++)
    {
        let c = cookieArr[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }

        if (c.indexOf(cookieName) == 0)
        {
            return c.substring(cookieName.length, c.length);
        }
    }

    return "";
}