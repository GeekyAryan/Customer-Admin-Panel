export default function Heading({title})
{
  return (
    <div style={ {
        fontFamily:'kanit',
        fontWeight:'bold',
        fontSize:20,
        letterSpacing:0.5,
        display:'flex',
    
        alignItems:'center',
        flexDirection:'row'
  
    }}>
      <img src="biglogo.png" width="60" />

      <div>{title} </div>
    </div>
  );
}
