document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscaruser")){
        if(e.key === "Escape")e.target.value = "";

        // document.querySelectorAll(".filtrar").forEach( tabla =>{
        //     tabla.textContent.toLowerCase().includes(e.target.value.toLowerCase())
        //     ?tabla.classList.remove("filtro")
        //     :tabla.classList.add("filtrar")
        // })
        pool.query('SELECT * FROM users WHERE username = ?')


    }
})
