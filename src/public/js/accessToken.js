

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.2/axios.min.js" integrity="sha512-NCiXRSV460cHD9ClGDrTbTaw0muWUBf/zB/yLzJavRsPNUl9ODkUVmUHsZtKu17XknhsGlmyVoJxLg/ZQQEeGA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
(()=>{
    const instance = axios.create({
        timeout: 4 * 1000,
        headers:{
            "Content-type": 'application/json'
        }
    })

    // Handle data before send to Server
    instance.interceptors.request.use(async ()=>{

    })

    // Handle data after send back from Server
    instance.interceptors.response.use(async (respone)=>{
        console.log("Handle data after send back from Server");
        
        return respone;
    }, err => Promise.reject(err))

})
()