document.addEventListener("DOMContentLoaded", () => {
    const btnEnviar = document.getElementById("btnEnviar");

    btnEnviar.addEventListener("click", async () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const img = document.getElementById("img").value;
        const code = document.getElementById("code").value;
        const stock = document.getElementById("stock").value;
        const category = document.getElementById("category").value;
        const status = document.getElementById("status").value === "true";

        const nuevoProducto = {
            title,
            description,
            price,
            img,
            code,
            stock,
            category,
            status,
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto agregado exitosamente:", data);
            } else {
                const errorData = await response.json();
                console.error("Error al agregar producto:", errorData.error);
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const btnEliminar = document.getElementById("btnEliminar");
    const message = document.getElementById("message");

    btnEliminar.addEventListener("click", async () => {
        const productId = document.getElementById("productId").value;

        if (!productId) {
            message.textContent = "Por favor, ingrese un ID de producto válido.";
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                message.textContent = "Producto eliminado exitosamente";
            } else {
                message.textContent = data.error || "Error al eliminar el producto";
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            message.textContent = "Error interno del servidor";
        }
    });
});