const PersonForm = ({
    addPerson,
    newName,
    newNumber,
    handleNameChange,
    handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
            placeholder="Enter name..." />
        </div>
        <div>number: <input
            value={newNumber}
            onChange={handleNumberChange}
            placeholder="Enter number..." />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

export default PersonForm