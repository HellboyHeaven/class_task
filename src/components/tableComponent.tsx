import React, { useState, useEffect } from 'react'
import '../css/Table.css';
import { FiTrash2 } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import Person from '../types/person';
import moment from 'moment';
import { wait } from '@testing-library/user-event/dist/utils';

const defaultDate = moment().subtract(18, 'years').format("YYYY-MM-DD")

export function TableComponent () {

    const [personData, setPersonData] = useState<Person[]>(JSON.parse(localStorage.getItem("persons")!) as Person[])
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [birthDate, setBirthDate] = useState<string>(defaultDate)
    const [deletedRows, setDeletedRows] = useState<number[]>([]);
    const [insertedIndex, setInsertedIndex] = useState<number>(-1);

    useEffect(() => {   
    setPersonData( fetchData())

      }, []);


    return (
        <table>
            <thead>
                <tr>
                    <th key={"FirstName"}>{"FirstName"}</th>
                    <th key={"LastName"}>{"FirstName"}</th>
                    <th key={"Age"}>{"Age"}</th>
                    <th ></th>
                </tr>
            </thead>
            <tbody id = "table-body">
            {personData != null && personData.length > 0 && personData.map((person, index) => (
                <tr key={index} className={`${deletedRows.includes(index) ? 'fade-out' : ''} active-row`}>
                    <td key={"FirstName" + index}>{person.firstName}</td>
                    <td key={"LastName" + index}>{person.lastName}</td>
                    <td key={"Age" + index}>{moment().diff( moment(person.birthDate), 'years')}</td>
                    <td>  <button type="button" onClick={() => deleteClick(person, index)}> <FiTrash2 className='icon' /></button> </td>   
                </tr>
               
            ))}
                <tr className={insertedIndex === personData.length ? 'fade-in' : 'active-row'}>
                   
                    <td>
                        <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </td>
                    <td>
                        <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </td>
                    <td>
                        <input type='date' 
                        max = {defaultDate}
                        value={moment(birthDate).format("YYYY-MM-DD")} 
                        onChange={(e) => setBirthDate(e.target.value)} />
                    </td>
                   
                    <td>  <button type="button" onClick={addClick}> <FiPlus className='icon' /></button> </td>
                </tr>
            </tbody>
        </table>
        
    );

    function deleteClick(  person : Person, index: number,) {
        const updatedData = personData.filter((e, i) => e !== person);
        setDeletedRows([...deletedRows, index]);
        
        setTimeout(() => {
            localStorage.setItem("persons", JSON.stringify(updatedData));
            setPersonData(updatedData); 
            setDeletedRows(deletedRows.filter(idx => idx !== index)); //
           
        }, 300); // Wait for the animati
    }

    // return <div></div>

    function addClick() {
        if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
            window.confirm(`Only Alphabetic in FirstName and LastName`)
            return
        }
        if (firstName.length < 3 || lastName.length < 3) {
            window.confirm(`Too short FirsName or LastName. Be 3 and More`)
            return
        }

        const updatedData = personData
        updatedData.push(new Person(firstName, lastName, moment(birthDate).format("YYYY-MM-DD")))
        setPersonData(updatedData);


        setFirstName("")
        setLastName("")
        setBirthDate(defaultDate)
        localStorage.setItem("persons", JSON.stringify(updatedData));
        
        
        setTimeout(() => {
            setInsertedIndex(- 1);
        }, 500); //
    }

    function fetchData() : Person[] {
        return localStorage.getItem("persons") != null ? JSON.parse(localStorage.getItem("persons")!) : [] as Person[]
    }
}



