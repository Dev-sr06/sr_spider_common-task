
const prime_num = 2147483647; 

function modAdd(a, b, m) {
    return (a + b) % m;
}


function modMultiply(a, b, m) {
    return (a * b) % m;
}


function modSubtract(a, b, m) {

    return (a - b + m) % m;
}


function modPow(base, exp, mod) {
    let res = 1;
    base %= mod;
    while (exp > 0) {

        if (exp % 2 === 1) res = modMultiply(res, base, mod);
        base = modMultiply(base, base, mod);
        exp = Math.floor(exp / 2);
    }

    return res;
}


function modInverse(a, m) {
    if (a === 0) {
        throw new Error("Modular inverse of 0 is not defined.");
    }
  
    return modPow(a, m - 2, m);
}




function splitSecret(secret, n, k) {
    if (k > n || k < 2) {
        throw new Error("Invalid parameters: k must be between 2 and n (inclusive).");
    }

    const coefficients = [secret];
    for (let i = 1; i < k; i++) {
        
        let coeff;
        do {
            coeff = Math.floor(Math.random() * prime_num);
        } 
        while (coeff === 0); 
        
        coefficients.push(coeff);
    }
    console.log("Polynomial Coefficients (a0 is secret):", coefficients);

  
    const shares = [];
    for (let x = 1; x <= n; x++) { 
        let y = 0;
        for (let i = 0; i < k; i++) {
            
            const term = modMultiply(coefficients[i], modPow(x, i, prime_num), prime_num);
            y = modAdd(y, term,prime_num);
        }
        shares.push([x, y]);
    }

    return shares;
}


function reconstructSecret(sharesSubset) {
    if (sharesSubset.length < 2) {

        throw new Error("At least two shares are required for reconstruction.");
    }

    let secret = 0; 

    for (let i = 0; i < sharesSubset.length; i++) {
        const xi = sharesSubset[i][0];
        const yi = sharesSubset[i][1];

        let Li_0 = 1; 

        for (let j = 0; j < sharesSubset.length; j++) {
            if (i !== j) {
                const xj = sharesSubset[j][0];

               
                const numerator = modSubtract(0, xj, prime_num);

              
                const denominator = modSubtract(xi, xj, prime_num);
                
                
                const invDenominator = modInverse(denominator, prime_num);

               
                Li_0 = modMultiply(Li_0, numerator, prime_num);
                Li_0 = modMultiply(Li_0, invDenominator, prime_num);
            }
        }
        
        secret = modAdd(secret, modMultiply(yi, Li_0, prime_num), prime_num);
    }
  
    return secret;
}

let shares = splitSecret(1234, 5, 3);
console.log("Generated Shares:", shares);

let selected = [shares[1], shares[2], shares[4]];
console.log("Using Shares:", selected);

let recovered = reconstructSecret(selected);
console.log("Recovered Secret:", recovered);
