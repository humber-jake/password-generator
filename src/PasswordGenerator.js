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


    let numbersChars = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
    let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let possibleChars = [];

    function handleLengthChange(e){
        setLength(e.target.value)
    }

    function handleSymbolChange(e){
        let input = e.target.value.replace(/\w/gi, '');
        let s = new Set(input)
        setSymbols([...s].join(''));
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

    function shuffle(a){
        let array = a;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function validatePassword(password){
        if(uppercase && /[A-Z]/.test(password) === false) return false;
        if(lowercase && /[a-z]/.test(password) === false) return false;
        if(numbers && [...password].every(i => (i.charCodeAt(0) < 48 || i.charCodeAt(0) > 57))) return false;
        if(symbols && [...password].every(i => [...symbols].includes(i))) return false;
        if(!duplicates){
            [...password].forEach(i => {
                if(password[i+1] && password[i+1] === password[i]) return false;
            })
        }
        return true;
    }

    function getOutput(e){
        e.preventDefault();
        let result = [];

        if (lowercase === false && uppercase === false){
            result = 'You must select at least one character set!'
            setResults(result);
            return;
        }

        if(lowercase === true){
            possibleChars.push(...lowercaseChars)
        }

        if(uppercase === true){
            possibleChars.push(...uppercaseChars)
        }

        if(numbers === true){
            possibleChars.push(...numbersChars)
        }

        for(let i = 0; i < quantity; i++){
            let p = generatePassword();
            while (!validatePassword(p)){
                p = generatePassword();
            };
            result.push(p);
        }
        result = result.join("\r\n")
        setResults(result);

        // for animation
        setGenerated(true)
        setTimeout(() => {
            setGenerated(false);
        }, 150)
    }

    function generatePassword(){
        let pass = shuffle(possibleChars).slice(0, length);

            if(symbols.length > 0){

                // limit symbols to half the password's characters at max
                let numOfSymbols = Math.min(symbols.length, Math.floor(pass.length / 2))

                for(let i = 0; i < numOfSymbols; i++){
                    let symbol = symbols[Math.floor(Math.random() * symbols.length)]
                    let randIdx = Math.floor(Math.random() * pass.length)
                        pass[randIdx] = symbol;
                    }
                }
            pass = pass.join('')
            return pass;
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
                    <button type="button" className={ generated ? 'clicked' : ''} onClick={getOutput}> Generate </button>
                </span>
            </form>

            <textarea id="textArea" className='results' value={results} onChange={handleResultsChange}></textarea>
        </div>
    );
};

export default PasswordGenerator;