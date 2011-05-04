$(function() {
    $('#draggable').draggable({
        opacity: 0.7, 
        helper: 'clone'
    });
    $('#holder').droppable({
        drop: function(event, ui) {
            var pos = ui.helper.position(),
            relative = $('#holder').position();
            pos.left -= relative.left;
            pos.top -= relative.top;
            var box = new UML.Box('Test', pos.left, pos.top);
            onClick(box.obj);
        }
    });
    $('#addConnection').button();

    var paper = Raphael($('#holder')[0], '100%', '100%');
    UML.paper = paper;
    var first = null,
    onClick = function(obj) {
        $(obj.node).mousedown(function() {
            if ($('#addConnection').is(':checked')) {
                if (!first) {
                    first = obj;
                } else {
                    uml.connect(first, obj);
                    first = null;
                    $('#addConnection').removeAttr('checked').button('refresh');
                }
            }
        });
    }, setup = function(template, element) {
        element.template = template;
        template.element = element;
        onClick(element.obj);
        return element;
    };
    



    var hack = function (aws) {
        $.get('aws/' + aws, function(data) {
            var i, k, l, element, element2, prop, template = new Template($.parseJSON(data));
            i = 0;
            for (k in template.Parameters) {
                setup(template.Parameters[k], new UML.Circle(k, 50 + 150 * i++, 100));
            }
            i = 0;
            for (k in template.Resources) {
                element = setup(template.Resources[k], new UML.Box(k, 50 + 200 * i++, 200));
               // element.attach(new UML.Icon(icon.linux));
                for (l in template.Resources[k]) {
                    prop = element.addProperty(l, template.Resources[k][l]);
                    element2 = template.Resources[k][l].element;
                    if (element2) {
                        prop.connect(element2);
                    }
                }
            }
        });
    };

    [
    'EC2WebSiteSample-1.0.0.template'
    /*   'EC2WithEBSSample-1.0.0.template',
    'ElasticBeanstalk-1.0.0.template',
    'ElasticBeanstalkSample-1.0.0.template',
    'ElasticBeanstalkSampleWithRoute53-1.0.0.template',
    'ELBSample-1.0.0.template',
    'ELBStickinessSample-1.0.0.template',
    'Gollum-1.0.0.template',
    'Gollum-NoSSH-1.0.0.template',
    'Insoshi-1.0.0.template',
    'Insoshi-NoSSH-1.0.0.template',
    'Joomla-1.0.0.template',
    'Joomla-NoSSH-1.0.0.template',
    'MonitorEC2AndEBS-1.0.0.template',
    'PHPHelloWorld-1.0.0.template',
    'PHPHelloWorld-NoSSH-1.0.0.template',
    'RailsHelloWorld-1.0.0.template',
    'RailsHelloWorld-NoSSH-1.0.0.template',
    'RDS_Version.template',
    'Redmine-1.0.0.template',
    'Redmine-NoSSH-1.0.0.template',
    'Route53_A.template',
    'Route53_CNAME.template',
    'Tracks-1.0.0.template',
    'Tracks-NoSSH-1.0.0.template',
    'WordPress-1.0.0.template',
    'WordPress-NoSSH-1.0.0.template' */
    ].forEach(function(aws) {
        hack(aws);
    });


});

