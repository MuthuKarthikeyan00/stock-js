function initializeDataTable(selector, ajaxUrl, columns, args={}) {
    $(document).ready(function() {
        columns.unshift({
            title: 'S.No', 
            data: null, 
            searchable: false,
            orderable: false, 
        });
        $(selector).DataTable({
            serverSide: true,
            ajax: {
                url: ajaxUrl,
                type: 'POST',
                data: function(d) {
                    return {
                        args,
                        draw: d.draw,
                        offset: d.start,
                        limit: d.length,
                        search: {
                            value: d.search.value,
                        },
                        order: d,
                        orderColumn: d.order[0].column,
                        orderDir: d.order[0].dir,
                    };
                },
            },
            columns: columns,
            responsive: true,
            paging: true,
            searching: true,

            
            drawCallback: function(settings) {              
                if(args?.footerVisble){
                    var api = this.api();          
                    var total = parseFloat(settings.json.recordsTotal); 
                    $(api.column(6).footer()).html(total);
                    if(selector=='#assetsHistroy'){
                       var total = api.column(6).data().reduce(function(a, b) {
                          a = a || 0;
                          b = b || 0;
                        return a + parseFloat(b);
                       }, 0);
                       $(api.column(6).footer()).html(total.toFixed(2));
                  }
                    
                }
            },
            createdRow: function(row, data, dataIndex) {
                var table = $(selector).DataTable();
                var pageInfo = table.page.info();
                var serialNumber = dataIndex + 1 + pageInfo.start; 
                $('td:eq(0)', row).html(serialNumber); 
            }
        });
    });
}
