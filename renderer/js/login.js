window.login = async function () {
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const results = await window.electronAPI.invoke("login", correo, contrasena);

    if (results.length > 0) {
      localStorage.setItem("usuario", JSON.stringify(results[0]));
      window.location.href = "perfil.html";
    } else {
      alert("Usuario incorrecto");
    }
  } catch (err) {
    console.log(err);
  }
};