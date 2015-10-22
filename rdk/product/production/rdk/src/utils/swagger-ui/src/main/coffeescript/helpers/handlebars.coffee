Handlebars.registerHelper('sanitize', (html) ->
    # Strip the script tags from the html, and return it as a Handlebars.SafeString
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    return new Handlebars.SafeString(html)
)

Handlebars.registerHelper 'eq', (a, b, opts) ->
    if a == b
        return opts.fn(this)
    else
        return opts.inverse(this)
