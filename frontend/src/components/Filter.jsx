function Filter({filter, handleChange}) {

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={handleChange}
        placeholder="Enter name filter..."
      />
    </div>
  );
}

export default Filter
