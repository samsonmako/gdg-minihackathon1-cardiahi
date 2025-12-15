function link(props:any){
 return(
    <>
    <a href="" className="link">
        { props.name ?? null}
    </a>
    </>
 )
}

export default link