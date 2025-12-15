 function button(props:any){
  return (
    <>
    <button className="btn outline">
       { props.value ?? null }
    </button>
    
    </>
  )
}

export default button