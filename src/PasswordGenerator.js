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
            let numbersChars = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
            let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
            let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

            if(lowercase === true){
                possibleChars.push(...lowercaseChars)
            }

            if(uppercase === true){
                possibleChars.push(...uppercaseChars)
            }
            
            let pass = [];

            // make intitial password out of letters
            for (let i = 0; i < length; i++) {
                let randIdx = Math.floor(Math.random() * possibleChars.length)
                pass.push(possibleChars[randIdx])
                
                if(!duplicates){
                    possibleChars.splice(randIdx, 1)
                }
            }

            // Add numbers if selected
            if(numbers === true){
                let randLength = Math.floor(Math.random() * length + 1)
                for(let i = 0; i < randLength; i++){
                    let randNumber = numbersChars[Math.floor(Math.random() * numbersChars.length)]
                    pass[Math.floor(Math.random() * pass.length)] = randNumber;

                    if(!duplicates){
                        numbersChars.splice(numbersChars.find(() => randNumber), 1)
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
                    let symbol = symbols[Math.floor(Math.random() * symbols.length)]
                    let randIdx = Math.floor(Math.random() * pass.length)

                    if(typeof pass[randIdx] == 'number'){
                        randIdx++
                    }

                    if(!duplicates){
                        if(!pass.includes(symbol)){
                            pass[randIdx] = symbol;
                        }
                    } else {
                        pass[randIdx] = symbol;
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
        if(navigator.clipboard){
            navigator.clipboard.writeText(results).then(() => {
                setCopied(true)
            }).catch(() => {
                alert('Oops! Something went wrong.')
            })
        } else {
            let textArea = document.getElementById('textArea');
            textArea.focus()
            textArea.select()
                new Promise((res, rej) => {
                    document.execCommand('copy') ? res() : rej();
                });
        }

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

            <textarea id="textArea" className='results' value={results} onChange={handleResultsChange}></textarea>
        </div>
    );
};

export default PasswordGenerator;