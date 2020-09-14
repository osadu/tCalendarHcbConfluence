package kz.hcb.tCalendarsHcbConfluence.macro;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.confluence.renderer.radeox.macros.MacroUtils;
import com.atlassian.confluence.util.velocity.VelocityUtils;

import java.util.Map;

public class TCalendarsHcbConfluenceMacro implements Macro {

    public String execute(Map<String, String> map, String s, ConversionContext conversionContext) throws MacroExecutionException {
        Map<String, Object> context = MacroUtils.defaultVelocityContext();
        context.putAll(map);
        return VelocityUtils.getRenderedTemplate("/templates/macro/tCalendarsHcbConluence.vm", context);
    }

    public BodyType getBodyType() { return BodyType.NONE; }

    public OutputType getOutputType() { return OutputType.BLOCK; }
}
