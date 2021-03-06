import React from 'react';
import { useState } from 'react';
import './PasswordGenerator.css'

const PasswordGenerator = () => {

    const [length, setLength] = useState(12);
    const [numbers, setNumbers] = useState(true)
    const [lowercase, setLowercase] = useState(true)
    const [uppercase, setUppercase] = useState(true)
    const [symbols, setSymbols] = useState(`!#$%&*+-<=>?@^~`);
    const [duplicates, setDuplicates] = useState(false)
    const [quantity, setQuantity] = useState(5)
    const [results, setResults] = useState('Passwords go here')
    const [copied, setCopied] = useState(false)
    const [generated, setGenerated] = useState(false)

    function handleLengthChange(e){
        setLength(e.target.value)
    }

    function handleSymbolChange(e){
        setSymbols(e.target.value)
    }

    function handleNumbersChange(e){
        setNumbers(!numbers)
    }
    function handleLowercaseChange(e){
        setLowercase(!lowercase)
    }
    function handleUppercaseChange(e){
        setUppercase(!uppercase)
    }
    function handleDuplicatesChange(e){
        setDuplicates(!duplicates)
    }
    function handleQuantityChange(e){
        setQuantity(e.target.value)
    }
    function handleResultsChange(e){
        setQuantity(e.target.value)
    }

    function generatePassword(e){
        e.preventDefault();
        let result = [];

        if (lowercase === false && uppercase === false){
            result = 'You must select at least one character set!'
            setResults(result);
            return;
        }

        for(let i = 0; i < quantity; i++){
            let possibleChars = [];
            let numbersChars = '1234567890'
            numbersChars = numbersChars.split('');
            let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
            let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

            if(lowercase === true){
                possibleChars.push(lowercaseChars)
            }

            if(uppercase === true){
                possibleChars.push(uppercaseChars)
            }

            possibleChars = possibleChars.join('').split('')
            
            let pass = [];

            // make intitial password out of letters
            for (let i = 0; i < length; i++) {
                let randIdx = Math.floor(Math.random() * possibleChars.length)
                pass.push(possibleChars[randIdx])
                
                if(!duplicates){
                    possibleChars.splice(randIdx, 1)
                }
            }

            if(numbers === true){
                for(let i = 0; i < Math.floor(Math.random() * pass.length); i++){
                    let randIdx = Math.floor(Math.random() * numbersChars.length)
                    pass[Math.floor(Math.random() * pass.length)] = numbersChars[randIdx];

                    console.log(numbersChars)

                    if(!duplicates){
                        numbersChars.splice(randIdx, 1)
                    }
                }
            }

            if(symbols.length > 0){

                // limit symbols to half the password's characters at max
                let limit = symbols.length;
                if(Math.floor(pass.length / 2) < symbols.length){
                    limit = Math.floor(pass.length / 2)
                }

                for(let i = 0; i < limit; i++){
                    let randIdx = Math.floor(Math.random() * symbols.length)
                    if(!duplicates){
                        if(!pass.includes(symbols[randIdx])){
                            pass[Math.floor(Math.random() * pass.length)] = symbols[randIdx];
                        }
                    } else {
                        pass[Math.floor(Math.random() * pass.length)] = symbols[randIdx];
                    }
                }
            }

            pass = pass.join('')
            result.push(pass);
        }
        result = result.join("\r\n")
        setResults(result);
        setGenerated(true)
        setTimeout(() => {
            setGenerated(false);
        }, 150)
    }

    function copyPassword(){
        navigator.clipboard.writeText(results)
        setCopied(true)
        setTimeout(() => {
            setCopied(false);
        }, 150)
    }


    return (
        <div className='container'>

            <h1>Password Generator</h1>

            <form action="" className='form'>
                <div>
                    <label htmlFor="length">Password Length:</label>
                    <input id="length" type="number" min={4} max={30} value={length} onChange={handleLengthChange}/>
                </div>
                <div>
                    <label htmlFor="numbers">Numbers:</label>
                    <input id="numbers" type="checkbox" checked={numbers} onChange={handleNumbersChange}/>
                </div>
                <div>
                    <label htmlFor="lowercase">Lowercase:</label>
                    <input id="lowercase" type="checkbox" checked={lowercase} onChange={handleLowercaseChange}/>
                </div>
                <div>
                    <label htmlFor="uppercase">Uppercase:</label>
                    <input id="uppercase" type="checkbox" checked={uppercase} onChange={handleUppercaseChange} />
                </div>
                <div>
                    <label htmlFor="symbols">Symbols:</label>
                    <input id="symbols" type="text" value={symbols} onChange={handleSymbolChange}/>
                </div>
                <div>
                    <label htmlFor="duplicates">Allow Duplicates:</label>
                    <input id="duplicates" type="checkbox" checked={duplicates} onChange={handleDuplicatesChange}/>
                </div>
                <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <input id="quantity" min={1} max={200} type="number" value={quantity} onChange={handleQuantityChange}/>
                </div>
                <span id='buttons'>
                    <button type="button" className={ copied ? 'clicked' : ''} onClick={copyPassword}> Copy </button>
                    <button type="button" className={ generated ? 'clicked' : ''} onClick={generatePassword}> Generate </button>
                </span>
            </form>

            <textarea className='results' value={results} onChange={handleResultsChange}></textarea>
        </div>
    );
};

export default PasswordGenerator;