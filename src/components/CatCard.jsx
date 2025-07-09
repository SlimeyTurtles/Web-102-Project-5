function CatCard({ cat, onRemove }) {
  const name = cat.breeds?.[0]?.name || "Unknown Breed";
    
  const handleClick = () => {
    onRemove(cat.id);
  };

  return (
    <div 
        onClick={handleClick}
        style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        width: "220px",
        textAlign: "center",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
        margin: "10px"
    }}>
      <img 
        src={cat.url} 
        alt={name} 
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3 style={{ marginTop: "8px" }}>{name}</h3>
    </div>
  );
}

export default CatCard;
