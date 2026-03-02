// custom route for blog list allowing optional page parameter
// the `?` marks `page` as optional so `/blog` still matches.
// the value will appear in `pageContext.routeParams.page`.
// route string uses @page syntax per vike recommendation
export default "/blog/@page?";