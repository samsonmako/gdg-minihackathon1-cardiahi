function card(props:any){




  return (
    <>
    
    <div className="card">
      <div className="header">
        Title
      </div>
      <div className="content">
        {props.name ?? null}
       </div>
       
      <div className="bottom">
        Bottom part
      </div>
    </div>
    </>
  )
}

export default card