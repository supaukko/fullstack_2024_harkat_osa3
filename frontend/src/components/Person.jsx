const Person = ({person, handleDelete}) => {
  //console.log('Person', person)
  return (
    <div>
        <span>{person.name} {person.number}</span>
        <button
            onClick={() => handleDelete(person.id)}>Delete</button>
    </div>
  )
}

export default Person