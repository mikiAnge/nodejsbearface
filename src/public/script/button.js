var campos_max          = 4;   //max de 10 campos

        var x = 0;
        $('#add_field').click (function(e) {
                e.preventDefault();     //prevenir novos clicks
                if (x < campos_max) {
                        /*$('#nombre').append('<div>\
                        <input type="text" class="form-control text-center" name="name" placeholder="name">\
                        </div>');
                        x++;*/
                        $('#ci').append('<div>\
                        <input type="text" class="form-control text-center" name="ci" placeholder="Cedula de Identidad" autocapitalize="words">\
                        </div>');
                        x++;
                }
        });
        // Remover o div anterior
        /*$('#name').on("click",".remover_campo",function(e) {
                e.preventDefault();
                $(this).parent('div').remove();
                x--;
        });*/
        $('#ci').on("click",".remover_campo",function(e) {
            e.preventDefault();
            $(this).parent('div').remove();
            x--;
        });
